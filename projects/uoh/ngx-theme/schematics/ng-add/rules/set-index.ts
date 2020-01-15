import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { Schema } from '../schema';
import { getIndexPath, readIndex } from '../../utils/get-index';
import { Snapshot } from '../models';

function addElements(tree: Tree, indexPath: string, html: string): void {
  try {
    const attribs = [
      '<meta http-equiv="X-UA-Compatible" content="IE=edge">',
      '<meta name="mobile-web-app-capable" content="yes">',
      '<meta name="apple-mobile-web-app-capable" content="yes">',
      '<meta name="theme-color" content="#0664AA">',
      '<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">'
    ];
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
 * @param index The index file contents stored before installing material.
 * @param snapshot The snapshot of the configuration files before the installation of material (to undo some material schematics).
 */
export function setIndex(_options: Schema, snapshot?: Snapshot): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const indexPath = getIndexPath(tree, _options.project);
    const html = snapshot && snapshot.index ? snapshot.index : readIndex(tree, indexPath);

    addElements(tree, indexPath, html);

    return tree;
  };
}
