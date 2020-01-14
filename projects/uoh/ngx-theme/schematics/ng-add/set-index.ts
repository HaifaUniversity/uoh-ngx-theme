import { Rule, SchematicContext, Tree, SchematicsException } from '@angular-devkit/schematics';
import { Schema } from './schema';
import { getWorkspace } from '@schematics/angular/utility/config';
import { getProjectFromWorkspace } from '../utils/get-project';
import { getProjectTargetOptions } from '../utils/get-project-target-options';

function addElements(tree: Tree, indexPath: string): void {
  const indexFile = tree.read(indexPath);
  if (!indexFile) {
    throw new SchematicsException(`Could not find the ${indexPath} file`);
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
    const missing = attribs.filter(attrib => !html.includes(attrib));

    if (missing.length > 0) {
      const additions = missing.reduce((prev, curr) => `${prev}\n\t\t${curr}`);
      const position = html.indexOf('</head>');
      const head = html.substring(0, position);
      const rest = html.substring(position);

      tree.overwrite(indexPath, `${head}\t${additions}\n\t${rest}`);
    }
  } catch (e) {
    console.warn(`Cannot set the html tags in the ${indexPath} file`, e);
  }
}

/**
 * Schematic to add attributes to the index.html file.
 * @param _options The options entered by the user in the cli.
 */
export function setIndex(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const workspace = getWorkspace(tree);
    const project = getProjectFromWorkspace(workspace, _options.project);
    const buildOptions = getProjectTargetOptions(project, 'build');

    addElements(tree, buildOptions.index);

    return tree;
  };
}
