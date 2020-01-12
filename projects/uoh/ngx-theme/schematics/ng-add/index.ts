import { Rule, SchematicContext, Tree, SchematicsException, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { experimental } from '@angular-devkit/core';
import * as ts from 'typescript';
import { addImportToModule } from '@schematics/angular/utility/ast-utils';
import { buildRelativePath } from '@schematics/angular/utility/find-module';
import { InsertChange } from '@schematics/angular/utility/change';
import { Schema } from './schema';

interface Asset {
  glob: string;
  input: string;
  output: string;
}

interface Config {
  options: {
    assets: Array<string | Asset>;
    styles: Array<string>;
    stylePreprocessorOptions?: {
      includePaths?: Array<string>;
    };
  };
}

interface Architect {
  build: Config;
  test: Config;
}

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
 * Schematics to add the uoh-theme to the angular.json file.
 * @param _options The options entered by the user in the cli.
 */
function setConfig(_options: Schema): Rule {
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

/**
 * Schematic to add attributes to the index.html file.
 * @param _options The options entered by the user in the cli.
 */
function setIndex(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const indexFile = tree.read('/src/index.html');
    if (!indexFile) {
      throw new SchematicsException('Could not find the index.html file');
    }

    try {
      const attribs = [
        '<meta http-equiv="X-UA-Compatible" content="IE=edge">',
        '<meta name="mobile-web-app-capable" content="yes">',
        '<meta name="apple-mobile-web-app-capable" content="yes">',
        '<meta name="theme-color" content="#0664AA">',
        '<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">'
      ];
      const html = indexFile.toString('utf-8');
      const additions = attribs.filter(attrib => !html.includes(attrib)).reduce((prev, curr) => `${prev}\n\t\t${curr}`);

      if (additions) {
        const position = html.indexOf('</head>');
        const head = html.substring(0, position);
        const rest = html.substring(position);

        tree.overwrite('/src/index.html', `${head}\t${additions}\n\t${rest}`);
      }
    } catch (e) {
      console.warn('Cannot set the html tags in the index.html file', e);
    }

    return tree;
  };
}

/**
 * Add the import statement for the UohModule.
 * @param tree The schematics tree
 * @param path The path to the module in which the UohModule should be imported
 * @param source The source file of the module in which the UohModule should be imported
 * @param uohModule The uoh module to import
 */
function addUohModuleImport(tree: Tree, path: string, source: ts.SourceFile, uohModule: string) {
  const relativePath = buildRelativePath(path, '/node_modules/@uoh/ngx-theme');
  const changes = addImportToModule(source, path, `Uoh${uohModule}Module`, relativePath);

  const recorder = tree.beginUpdate(path);
  for (const change of changes) {
    if (change instanceof InsertChange) {
      recorder.insertLeft(change.pos, change.toAdd);
    }
  }

  tree.commitUpdate(recorder);
}

/**
 * Adds the import statements to the theme modules to the app module.
 * @param _options The options entered by the user in the cli.
 */
function addImportsToAppModule(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const path = '/src/app/app.module.ts';
    const appModule = tree.read(path);
    if (!appModule) {
      throw new SchematicsException('Could not find the app.module.ts file');
    }

    try {
      const text = appModule.toString('utf-8');
      const source = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true);

      if (_options.header) {
        addUohModuleImport(tree, path, source, 'Header');
      }

      if (_options.footer) {
        addUohModuleImport(tree, path, source, 'Footer');
      }

      if (_options.spinner) {
        addUohModuleImport(tree, path, source, 'Spinner');
      }

      if (_options.backToTop) {
        addUohModuleImport(tree, path, source, 'BackToTop');
      }

      if (_options.accessibility) {
        addUohModuleImport(tree, path, source, 'Accessibility');
      } else {
        addUohModuleImport(tree, path, source, 'Body');
      }
    } catch (e) {
      console.warn('Cannot add the theme modules to the app.module file', e);
    }

    return tree;
  };
}

/**
 * Angular ngAdd schematics that adds all the uoh-theme configurations.
 * @param _options The options entered by the user in the cli.
 */
export function ngAdd(_options: Schema): Rule {
  return (_, _context: SchematicContext) => {
    _context.addTask(new NodePackageInstallTask());

    return chain([setConfig(_options), setIndex(_options), addImportsToAppModule(_options)]);
  };
}
