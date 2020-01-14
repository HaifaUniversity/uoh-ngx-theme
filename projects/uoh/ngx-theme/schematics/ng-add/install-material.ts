import { Rule, SchematicContext, externalSchematic } from '@angular-devkit/schematics';

import { Schema } from './schema';

export function installMaterial(_options: Schema): Rule {
  return (_, _context: SchematicContext) => {
    return externalSchematic('@angular/material', 'ng-add', { ..._options, theme: 'indigo-pink' });
  };
}
