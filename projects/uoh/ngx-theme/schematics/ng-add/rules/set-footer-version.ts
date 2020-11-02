import { Rule, Tree, SchematicContext, SchematicsException, chain } from '@angular-devkit/schematics';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { getWorkspace } from '@schematics/angular/utility/config';
import { getAppModulePath } from '@schematics/angular/utility/ng-ast-utils';
import { WorkspaceProject } from '@angular-devkit/core/src/experimental/workspace';
import { getProjectFromWorkspace } from '../../utils/get-project';
import { getProjectMainFile } from '../../utils/get-project-main-file';
import { searchSubdirs } from '../../utils/search-subdirs';

import { Schema } from '../schema';
import { insertImport, isImported } from '@schematics/angular/utility/ast-utils';
import { Change, InsertChange } from '@schematics/angular/utility/change';
import { getProperties, propertyExists } from '../../utils/properties.util';
import { shouldSetFooter } from '../../utils/set-footer';
import { resolveJSONModule } from './resolve-json-module';

const VERSION_PROPERTY = 'version';
const PACKAGE = 'package.json';
const PACKAGE_VERSION = 'version';
const APP_COMPONENT = 'app.component.ts';

/**
 * Retrieves the path to the app.component.ts file.
 * @param tree The schematics tree.
 * @param project The workspace project.
 */
function getAppComponentPath(tree: Tree, project: WorkspaceProject) {
  const appModulePath = getAppModulePath(tree, getProjectMainFile(project));
  const dirPath = appModulePath.substring(0, appModulePath.lastIndexOf('/'));
  const path = `${dirPath}/${APP_COMPONENT}`;

  try {
    if (tree.exists(path)) {
      // The app.component.html file is in the same path as the app.module.
      return path;
    } else {
      // Try to find in the subdirs.
      return searchSubdirs(tree, path, APP_COMPONENT);
    }
  } catch (e) {
    console.warn(`Cannot get the default app template file`, e);
  }

  return '';
}

/**
 * Imports the version from package.json and adds a property in the given ts file (normally app.component.ts).
 * @param path The path to file.
 * @param tree The schematics tree.
 */
function addVersion(path: string, tree: Tree): Change[] {
  const source = tree.read(path);

  if (!source) {
    throw new SchematicsException(`The file ${path} does not exist.`);
  }
  const text = source.toString('utf-8');

  const root = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true);

  const properties = getProperties(root);

  if (propertyExists(properties, VERSION_PROPERTY)) {
    return [];
  }

  const importChange = !isImported(root, PACKAGE_VERSION, PACKAGE)
    ? insertImport(root, path, PACKAGE_VERSION, PACKAGE)
    : undefined;

  const versionChange = new InsertChange(
    path,
    properties[0].getStart(),
    `version = version;
  `
  );

  return !!importChange ? [importChange, versionChange] : [versionChange];
}

function addFooterVersion(options?: Schema): Rule {
  return (tree: Tree, _context: SchematicContext): Tree => {
    const projectName = !!options && !!options.project ? options.project : undefined;
    const workspace = getWorkspace(tree);
    const project = getProjectFromWorkspace(workspace, projectName);
    const appComponentPath = getAppComponentPath(tree, project);
    const changes = addVersion(appComponentPath, tree);

    const recorder = tree.beginUpdate(appComponentPath);

    for (const change of changes) {
      if (change instanceof InsertChange) {
        recorder.insertLeft(change.pos, change.toAdd);
      }
    }

    tree.commitUpdate(recorder);

    return tree;
  };
}

/**
 * Retrieves the package version and sets it as an input in the footer.
 * @param options The options entered in the cli.
 */
export function setFooterVersion(options?: Schema): Rule {
  return (tree: Tree, _context: SchematicContext): Rule => {
    const rules: Rule[] = shouldSetFooter(tree, options) ? [resolveJSONModule(), addFooterVersion(options)] : [];

    return chain(rules);
  };
}
