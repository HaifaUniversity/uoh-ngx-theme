import { Rule, SchematicContext, externalSchematic, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import { Schema } from './schema';
import { getPackageVersionFromPackageJson, addPackageToPackageJson } from '../utils/package-config';

// The material version will be filled in during compilation from the dependencies in the package.json of this project.
const materialVersion = `~0.0.0-PLACEHOLDER`;

export function installMaterial(_options: Schema): Rule {
  return (host: Tree, _context: SchematicContext) => {
    const materialInstalled = getPackageVersionFromPackageJson(host, '@angular/material');

    if (!materialInstalled) {
      addPackageToPackageJson(host, '@angular/material', materialVersion);
      _context.addTask(new NodePackageInstallTask());
    }

    return externalSchematic('@angular/material', 'ng-add', { ..._options, theme: 'custom' });
  };
}
