import { Rule, SchematicContext, Tree, SchematicsException } from '@angular-devkit/schematics';
import { experimental } from '@angular-devkit/core';
import { Asset, Architect, Config } from './models';
import { Schema } from './schema';

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
      tree.overwrite(stylesPath, `@include uoh-theme();\n${styles}`);
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
    const base = './';
    const include = './node_modules/@uoh/ngx-theme/theme';

    if (!config.options.stylePreprocessorOptions) {
      config.options.stylePreprocessorOptions = {
        includePaths: [base, include]
      };
    } else if (!config.options.stylePreprocessorOptions.includePaths) {
      config.options.stylePreprocessorOptions.includePaths = [base, include];
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
 */
export function setConfig(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const workspaceConfig = tree.read('/angular.json');
    if (!workspaceConfig) {
      throw new SchematicsException('Could not find Angular workspace configuration');
    }

    // convert workspace to string
    const workspaceContent = workspaceConfig.toString('utf-8');

    // parse workspace string into JSON object
    const workspace: experimental.workspace.WorkspaceSchema = JSON.parse(workspaceContent);
    const projectName = workspace.defaultProject as string;
    const project = workspace.projects[projectName];

    const assets: Array<Asset> = [
      { glob: 'favicon.ico', input: './node_modules/@uoh/ngx-theme/assets', output: '/' },
      { glob: '**/*', input: './node_modules/@uoh/ngx-theme/assets', output: '/assets/' }
    ];

    if (project.architect) {
      const architect: Architect = project.architect as Architect;
      addAssets(architect.build, assets);
      addAssets(architect.test, assets);

      const stylesPath = getStylesPath(architect.build.options.styles);

      if (stylesPath) {
        includeTheme(architect.build);
        includeTheme(architect.test);
        addThemeMixin(tree, stylesPath);
      }

      tree.overwrite('/angular.json', JSON.stringify(workspace, null, 2));
    }

    return tree;
  };
}
