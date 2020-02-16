import { Rule, SchematicContext, chain } from '@angular-devkit/schematics';

import { Schema } from './schema';
import { setConfig } from './rules/set-config';
import { setIndex } from './rules/set-index';
import { importModules } from './rules/import-modules';
import { setTemplate } from './rules/set-template';

export function setupProject(_options: Schema): Rule {
  return (_, _context: SchematicContext) => {
    return chain([setConfig(_options), setIndex(_options), importModules(_options), setTemplate(_options)]);
  };
}
