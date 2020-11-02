import { Tree, Rule, SchematicContext, chain } from '@angular-devkit/schematics';
import { setFooterVersion } from '../ng-add/rules/set-footer-version';
import { setIndex } from '../ng-add/rules/set-index';

export function updateToV5(_: any): Rule {
  return (_tree: Tree, _context: SchematicContext): Rule => {
    return setIndex();
  };
}

export function updateToV9(_: any): Rule {
  return (_tree: Tree, _context: SchematicContext): Rule => {
    return chain([setIndex(), setFooterVersion()]);
  };
}
