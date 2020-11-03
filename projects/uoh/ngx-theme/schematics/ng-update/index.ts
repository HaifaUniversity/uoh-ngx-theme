import { Tree, Rule, SchematicContext } from '@angular-devkit/schematics';
import { setFooterVersion } from '../ng-add/rules/set-footer-version';
import { setIndex } from '../ng-add/rules/set-index';

export function updateToV5(_: any): Rule {
  return (_tree: Tree, _context: SchematicContext): Rule => {
    return setIndex();
  };
}

export function updateToV10(_: any): Rule {
  return (_tree: Tree, _context: SchematicContext): Rule => {
    return setFooterVersion();
  };
}
