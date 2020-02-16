import { Tree, Rule, SchematicContext } from '@angular-devkit/schematics';
import { NodePackageInstallTask, RunSchematicTask } from '@angular-devkit/schematics/tasks';
import { getPackageVersionFromPackageJson, addPackageToPackageJson } from '../utils/package-config';

import { Schema } from './schema';

// The material version will be filled in during compilation from the dependencies in the package.json of this project.
const materialVersion = `~0.0.0-PLACEHOLDER`;

/**
 * Angular ngAdd schematics that adds all the uoh-theme configurations.
 * @param _options The options entered by the user in the cli.
 */
export function ngAdd(_options: Schema): Rule {
  return (host: Tree, _context: SchematicContext) => {
    const materialInstalled = getPackageVersionFromPackageJson(host, '@angular/material');
    const cdkInstalled = getPackageVersionFromPackageJson(host, '@angular/cdk');

    if (!materialInstalled) {
      addPackageToPackageJson(host, '@angular/material', materialVersion);
    }

    if (!cdkInstalled) {
      addPackageToPackageJson(host, '@angular/cdk', materialVersion);
    }

    const installPackages = _context.addTask(new NodePackageInstallTask());

    _context.addTask(new RunSchematicTask('ng-add-setup-project', _options), [installPackages]);
  };
}
