import { Rule, SchematicContext, chain } from '@angular-devkit/schematics';

import { Schema } from './schema';
import { setConfig } from './rules/set-config';
import { setIndex } from './rules/set-index';
import { importModules } from './rules/import-modules';
import { setTemplate } from './rules/set-template';
import { Snapshot } from './models';

interface SetupSchema extends Schema {
  snapshot?: Snapshot;
}

export function setupProject(_options: SetupSchema): Rule {
  return (_, _context: SchematicContext) => {
    return chain([
      setConfig(_options, _options.snapshot),
      setIndex(_options, _options.snapshot),
      importModules(_options),
      setTemplate(_options)
    ]);
  };
}
