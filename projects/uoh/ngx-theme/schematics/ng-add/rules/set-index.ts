import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';
import { Schema } from '../schema';
import { setIndexHtml } from '../../utils/set-index-html';

/**
 * Schematic to add attributes to the index.html file.
 * @param options The options entered by the user in the cli.
 */
export function setIndex(options?: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const projectName = !!options && !!options.project ? options.project : undefined;
    try {
      setIndexHtml(tree, projectName);
    } catch (e) {
      context.logger.warn(`Cannot set the index.html for the project ${projectName}`, e);
    }

    return tree;
  };
}
