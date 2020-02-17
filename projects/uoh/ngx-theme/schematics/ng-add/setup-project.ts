import { Rule, SchematicContext, Tree, chain } from '@angular-devkit/schematics';

import { Schema } from './schema';
import { setConfig } from './rules/set-config';
import { setIndex } from './rules/set-index';
import { importModules } from './rules/import-modules';
import { setTemplate } from './rules/set-template';

export function setupProject(options: Schema): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([setConfig(options), setIndex(options), importModules(options), setTemplate(options)]);
  };
}
