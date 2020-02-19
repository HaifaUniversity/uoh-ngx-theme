import { Tree, Rule, SchematicContext } from '@angular-devkit/schematics';

import { setIndex } from './rules/set-index';

export function updateToV5(_: any): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return setIndex();
  };
}
