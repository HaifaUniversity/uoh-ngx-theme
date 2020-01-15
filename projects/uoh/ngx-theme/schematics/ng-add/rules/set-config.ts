import { Rule, SchematicContext, Tree, SchematicsException } from '@angular-devkit/schematics';
import { WorkspaceTool } from '@angular-devkit/core/src/experimental/workspace';
import { getWorkspace, updateWorkspace } from '@schematics/angular/utility/config';
import { Asset, Config } from '../models';
import { Schema } from '../schema';
import { getProjectFromWorkspace } from '../../utils/get-project';
import { getProjectTargetOptions } from '../../utils/get-project-target-options';

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
 * Returns the path to the styles file from a list of file paths.
 * @param files The list of files to check.
 */
function getStylesPath(files: Array<string>): string | undefined {
  let fallback: string | undefined = undefined;

  for (const item of files) {
    if (item.includes('styles.scss')) {
      return item;
    } else if (!fallback && item.endsWith('.scss')) {
      fallback = item;
    }
  }

  return fallback;
}

/**
 * Adds the uoh theme mixin to the styles.scss file.
 * @param tree The schematics Tree.
 * @param stylesPath The path to the styles.scss file.
 */
function addThemeMixin(tree: Tree, stylesPath: string): void {
  const stylesFile = tree.read(stylesPath);
  if (!stylesFile) {
    throw new SchematicsException(`Could not find the ${stylesPath} file`);
  }

  try {
    const styles = stylesFile.toString('utf-8');

    if (!styles.includes('uoh-theme')) {
      const insertion = `@import "theme";\n\n@include uoh-theme();\n`;
      const recorder = tree.beginUpdate(stylesPath);

      recorder.insertLeft(styles.length, insertion);
      tree.commitUpdate(recorder);
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

function removeMaterialTheme(styles: Array<string>): Array<string> {
  return styles.filter(item => !item.includes('@angular/material'));
}

function removeMaterialStyles(architect: WorkspaceTool): void {
  try {
    architect.build.options.styles = removeMaterialTheme(architect.build.options.styles);
    architect.test.options.styles = removeMaterialTheme(architect.test.options.styles);
  } catch (e) {
    console.warn('Cannot remove the material styles', e);
  }
}

/**
 * Schematics to add the uoh-theme to the angular.json file.
 * @param _options The options entered by the user in the cli.
 */
export function setConfig(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const workspace = getWorkspace(tree);
    const project = getProjectFromWorkspace(workspace, _options.project);

    const assets: Array<Asset> = [
      { glob: 'favicon.ico', input: './node_modules/@uoh/ngx-theme/assets', output: '/' },
      { glob: '**/*', input: './node_modules/@uoh/ngx-theme/assets', output: '/assets/' }
    ];

    const architect: WorkspaceTool | undefined = project.targets ? project.targets : project.architect;
    if (architect) {
      removeMaterialStyles(architect);
      addAssets(architect.build, assets);
      addAssets(architect.test, assets);

      const buildOptions = getProjectTargetOptions(project, 'build');
      const stylesPath = getStylesPath(buildOptions.styles);

      if (stylesPath) {
        includeTheme(architect.build);
        includeTheme(architect.test);
        addThemeMixin(tree, stylesPath);
      }

      return updateWorkspace(workspace);
    }

    return tree;
  };
}
