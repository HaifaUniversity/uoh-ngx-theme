import { Rule, Tree } from '@angular-devkit/schematics';
import { getWorkspace } from '../../utils/config';
import { Asset } from '../models';
import { Schema } from '../schema';
import { getProjectFromWorkspace } from '../../utils/get-project';
import { getStylesPathFromProject } from '../../utils/get-styles';
import { readStringFile } from '../../utils/read-file';
import { updateWorkspace } from '../../utils/update-workspace';
import {
  BrowserBuilderTarget,
  ProjectType,
  TestBuilderTarget,
  WorkspaceTargets,
} from '@schematics/angular/utility/workspace-models';

type BuilderTarget = BrowserBuilderTarget | TestBuilderTarget;

const ASSETS_TO_ADD: Array<Asset> = [
  { glob: 'favicon.ico', input: './node_modules/@uoh/ngx-theme/assets', output: '/' },
  { glob: '**/*', input: './node_modules/@uoh/ngx-theme/assets', output: '/assets/' },
];
const ASSET_TO_REMOVE = 'src/favicon.ico';

/**
 * Checks if a Asset exists in a given list.
 * @param assets A list of Assets.
 * @param asset The Asset to check.
 */
function assetExists(assets: Array<string | object> | undefined, asset: Asset): boolean {
  try {
    if (!!assets) {
      for (const value of assets) {
        const item = value as any;
        if (!!item.glob && item.glob === asset.glob) {
          return true;
        }
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
function addAssets(config: BuilderTarget, assets: Array<Asset>): void {
  try {
    if (!!assets) {
      for (const asset of assets) {
        if (!!config.options && !!config.options.assets && !assetExists(config.options.assets, asset)) {
          config.options.assets.push(asset);
        }
      }
    }
  } catch (e) {
    console.warn(e);
  }
}

function removeAsset(config: BuilderTarget, target: Asset | string): void {
  try {
    if (!!config && !!config.options && !!config.options.assets) {
      for (let i = 0; i < config.options.assets.length; i++) {
        const asset = config.options.assets[i];
        if (target === asset || (target as Asset).glob === (asset as Asset).glob) {
          config.options.assets.splice(i, 1);
        }
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
function includeTheme(config: any): void {
  try {
    const include = './node_modules/@uoh/ngx-theme';

    if (!config.options.stylePreprocessorOptions) {
      config.options.stylePreprocessorOptions = {
        includePaths: [include],
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
 * @param options The options entered by the user in the cli.
 */
export function setConfig(options: Schema): Rule {
  return (tree: Tree, _) => {
    const workspace = getWorkspace(tree);
    const project = getProjectFromWorkspace(workspace, options.project);

    const architect: WorkspaceTargets<ProjectType.Application> | undefined = project.targets
      ? project.targets
      : project.architect;
    if (architect) {
      if (!!architect.build) {
        removeAsset(architect.build, ASSET_TO_REMOVE);
        addAssets(architect.build, ASSETS_TO_ADD);
        includeTheme(architect.build);
      }

      if (!!architect.test) {
        removeAsset(architect.test, ASSET_TO_REMOVE);
        addAssets(architect.test, ASSETS_TO_ADD);
        includeTheme(architect.test);
      }

      const stylesPath = getStylesPathFromProject(project);

      if (stylesPath) {
        const styles = readStringFile(tree, stylesPath);
        addThemeMixin(tree, stylesPath, styles);
      }

      return updateWorkspace(workspace);
    }

    return tree;
  };
}
