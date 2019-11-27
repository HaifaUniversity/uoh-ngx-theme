import { Rule, SchematicContext, Tree, SchematicsException, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { experimental } from '@angular-devkit/core';

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

function instanceOfAsset(asset: any): asset is Asset {
  return !!asset.glob;
}

function assetExists(assets: Array<string | Asset>, asset: Asset): boolean {
  try {
    for (const item of assets) {
      if (instanceOfAsset(item) && item.glob === asset.glob) {
        return true;
      }
    }
  } catch (e) {
    console.warn(e);
  }

  return false;
}

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

function getStylesPath(styles: Array<string>): string | undefined {
  let fallback: string | undefined = undefined;

  for (const item of styles) {
    if (item.includes('styles.scss')) {
      return item;
    } else if (!fallback && item.endsWith('.scss')) {
      fallback = item;
    }
  }

  return fallback;
}

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

function setConfig(_options: any): Rule {
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

function setIndex(_options: any): Rule {
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

export function ngAdd(_options: any): Rule {
  return (_, _context: SchematicContext) => {
    _context.addTask(new NodePackageInstallTask());

    return chain([setConfig(_options), setIndex(_options)]);
  };
}