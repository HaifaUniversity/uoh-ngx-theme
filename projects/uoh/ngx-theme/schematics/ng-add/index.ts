import { Tree, Rule, SchematicContext } from '@angular-devkit/schematics';
import { NodePackageInstallTask, RunSchematicTask } from '@angular-devkit/schematics/tasks';
import { getPackageVersionFromPackageJson, addPackageToPackageJson } from '../utils/package-config';

import { Schema } from './schema';

// The material version will be filled in during compilation from the peer dependencies in the package.json of this project.
const MAT_VERSION_DEPENDENCY = `~0.0.0-PLACEHOLDER`;

// The material versions will be filled in during the compilation from 'material.angular.io'.
const MATERIAL_VERSIONS: Array<string> = []; // MAT_VERSIONS_PLACEHOLDER

/**
 * Retrieves the major version from a version string, i.e.: '^9.0.0' will return '9'.
 * @param version The version to get the major version from.
 */
function getMajorVersion(version: string): string | undefined {
  try {
    const matches = version.match(/\d+/gm);

    return !!matches && matches.length > 0 ? matches[0] : undefined;
  } catch (e) {}

  return undefined;
}

/**
 * Retrieves the last material version from the list of MATERIAL_VERSIONS.
 */
function getLastMaterialVersion(): string | undefined {
  try {
    return `~${MATERIAL_VERSIONS[MATERIAL_VERSIONS.length - 1]}`;
  } catch (e) {}

  return undefined;
}

/**
 * Retrieves the material and cdk version to be installed.
 * @param host The schematics tree.
 */
function getMaterialVersion(host: Tree): string {
  const ngVersion = getPackageVersionFromPackageJson(host, '@angular/core');
  const ngMajorVersion = !!ngVersion ? getMajorVersion(ngVersion) : undefined;

  if (MATERIAL_VERSIONS && MATERIAL_VERSIONS.length > 0) {
    if (ngMajorVersion) {
      for (const version of MATERIAL_VERSIONS) {
        if (getMajorVersion(version) === ngMajorVersion) {
          return `~${version}`;
        }
      }
    }

    const lastMatVersion = getLastMaterialVersion();
    if (lastMatVersion) {
      return lastMatVersion;
    }
  }

  return MAT_VERSION_DEPENDENCY;
}

/**
 * Angular ngAdd schematics that adds all the uoh-theme configurations.
 * @param options The options entered by the user in the cli.
 */
export function ngAdd(options: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    const materialInstalled = getPackageVersionFromPackageJson(host, '@angular/material');
    const cdkInstalled = getPackageVersionFromPackageJson(host, '@angular/cdk');
    const materialVersion = getMaterialVersion(host);

    if (!materialInstalled) {
      addPackageToPackageJson(host, '@angular/material', materialVersion);
    }

    if (!cdkInstalled) {
      addPackageToPackageJson(host, '@angular/cdk', materialVersion);
    }

    const installPackages = context.addTask(new NodePackageInstallTask());

    context.addTask(new RunSchematicTask('ng-add-setup-project', options), [installPackages]);
  };
}
