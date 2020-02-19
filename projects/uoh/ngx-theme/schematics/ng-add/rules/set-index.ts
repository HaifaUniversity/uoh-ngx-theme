import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';
import { Schema } from '../schema';
import { setIndexHtml } from '../../utils/set-index-html';

/**
 * Schematic to add attributes to the index.html file.
 * @param options The options entered by the user in the cli.
 * @param index The index file contents stored before installing material.
 */
export function setIndex(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    try {
      setIndexHtml(tree, options.project);
    } catch (e) {
      context.logger.warn(`Cannot set the index.html for the project ${options.project}`, e);
    }

    return tree;
  };
}
