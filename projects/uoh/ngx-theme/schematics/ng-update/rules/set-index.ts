import { Tree, Rule, SchematicContext } from '@angular-devkit/schematics';

import { setIndexHtml } from '../../utils/set-index-html';

export function setIndex(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    try {
      setIndexHtml(tree);
    } catch (e) {
      context.logger.warn(`Cannot set the index.html for the default project`, e);
    }

    return tree;
  };
}
