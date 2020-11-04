import { Tree, Rule, SchematicContext, chain } from '@angular-devkit/schematics';
import { setFooterVersion } from '../ng-add/rules/set-footer-version';
import { setIndex } from '../ng-add/rules/set-index';
import { fixImportModulesPath } from './rules/fix-import-modules-path';

export function updateToV5(_: any): Rule {
  return (_tree: Tree, _context: SchematicContext): Rule => {
    return setIndex();
  };
}

export function updateToV10(_: any): Rule {
  return (_tree: Tree, _context: SchematicContext): Rule => {
    return chain([setFooterVersion(), fixImportModulesPath()]);
  };
}
