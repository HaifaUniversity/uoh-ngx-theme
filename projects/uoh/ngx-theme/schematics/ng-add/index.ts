import { Rule, SchematicContext, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import { Schema } from './schema';
import { setConfig } from './set-config';
import { setIndex } from './set-index';
import { importModules } from './import-modules';
import { setTemplate } from './set-template';

/**
 * Angular ngAdd schematics that adds all the uoh-theme configurations.
 * @param _options The options entered by the user in the cli.
 */
export function ngAdd(_options: Schema): Rule {
  return (_, _context: SchematicContext) => {
    _context.addTask(new NodePackageInstallTask());

    return chain([setConfig(_options), setIndex(_options), importModules(_options), setTemplate(_options)]);
  };
}
