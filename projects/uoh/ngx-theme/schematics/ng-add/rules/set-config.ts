import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { WorkspaceTool } from '@angular-devkit/core/src/experimental/workspace';
import { getWorkspace, updateWorkspace } from '@schematics/angular/utility/config';
import { Asset, Config, Snapshot } from '../models';
import { Schema } from '../schema';
import { getProjectFromWorkspace } from '../../utils/get-project';
import { getStylesPathFromProject } from '../../utils/get-styles';
import { readStringFile } from '../../utils/read-file';

/**
 * Checks if a Asset exists in a given list.
 * @param assets A list of Assets.
 * @param asset The Asset to check.
 */
function assetExists(assets: Array<string | Asset>, asset: Asset): boolean {
  try {
    for (const value of assets) {
      const item = value as any;
      if (!!item.glob && item.glob === asset.glob) {
        return true;
      }
    }
  } catch (e) {
    console.warn(e);
  }

  return false;
}

/**
 * Adds a list of assets to the angular config.
 * @param config The configuration from the angular.json file.
 * @param assets The list of Assets to add.
 */
function addAssets(config: Config, assets: Array<Asset>): void {
  try {
    for (const asset of assets) {
      if (!assetExists(config.options.assets, asset)) {
        config.options.assets.push(asset);
      }
    }
  } catch (e) {
    console.warn(e);
  }
}

/**
 * Adds the uoh theme mixin to the styles.scss file.
 * @param tree The schematics Tree.
 * @param stylesPath The path to the styles.scss file.
 * @param styles The styles file contents.
 */
function addThemeMixin(tree: Tree, stylesPath: string, styles: string): void {
  try {
    if (!styles.includes('uoh-theme')) {
      const updated = `${styles}\n@import "theme";\n\n@include uoh-theme();\n`;
      tree.overwrite(stylesPath, updated);
    }
  } catch (e) {
    console.warn('Cannot set the styles', e);
  }
}

/**
 * Adds the uoh theme to the angular configuration.
 * @param config The configuration from the angular.json.
 */
function includeTheme(config: Config): void {
  try {
    const include = './node_modules/@uoh/ngx-theme';

    if (!config.options.stylePreprocessorOptions) {
      config.options.stylePreprocessorOptions = {
        includePaths: [include]
      };
    } else if (!config.options.stylePreprocessorOptions.includePaths) {
      config.options.stylePreprocessorOptions.includePaths = [include];
    } else if (!config.options.stylePreprocessorOptions.includePaths.includes(include)) {
      config.options.stylePreprocessorOptions.includePaths.push(include);
    }
  } catch (e) {
    console.warn(e);
  }
}

/**
 * Schematics to add the uoh-theme to the angular.json file.
 * @param _options The options entered by the user in the cli.
 * @param snapshot The snapshot of the configuration files before the installation of material (to undo some material schematics).
 */
export function setConfig(_options: Schema, snapshot?: Snapshot): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const workspace = getWorkspace(tree);
    const project = getProjectFromWorkspace(workspace, _options.project);

    const assets: Array<Asset> = [
      { glob: 'favicon.ico', input: './node_modules/@uoh/ngx-theme/assets', output: '/' },
      { glob: '**/*', input: './node_modules/@uoh/ngx-theme/assets', output: '/assets/' }
    ];

    const architect: WorkspaceTool | undefined = project.targets ? project.targets : project.architect;
    if (architect) {
      addAssets(architect.build, assets);
      addAssets(architect.test, assets);
      includeTheme(architect.build);
      includeTheme(architect.test);

      const stylesPath = getStylesPathFromProject(project);

      if (stylesPath) {
        if (snapshot) {
          console.log(`*** snapshot ${snapshot.styles} ***`);
        }
        const styles = snapshot && snapshot.styles !== undefined ? snapshot.styles : readStringFile(tree, stylesPath);
        addThemeMixin(tree, stylesPath, styles);
      }

      return updateWorkspace(workspace);
    }

    return tree;
  };
}
