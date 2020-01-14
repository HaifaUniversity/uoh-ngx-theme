import { Rule, SchematicContext } from '@angular-devkit/schematics';
import { NodePackageInstallTask, RunSchematicTask } from '@angular-devkit/schematics/tasks';

import { Schema } from './schema';

/**
 * Angular ngAdd schematics that adds all the uoh-theme configurations.
 * @param _options The options entered by the user in the cli.
 */
export function ngAdd(_options: Schema): Rule {
  return (_, _context: SchematicContext) => {
    const installMaterial = _context.addTask(new RunSchematicTask('ng-add-install-material', _options));
    const installTheme = _context.addTask(new NodePackageInstallTask(), [installMaterial]);

    _context.addTask(new RunSchematicTask('ng-add-setup-project', _options), [installTheme]);
  };
}
