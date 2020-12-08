import { Rule, Tree, SchematicContext, chain } from '@angular-devkit/schematics';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { getWorkspace } from '@schematics/angular/utility/config';
import { getAppModulePath } from '@schematics/angular/utility/ng-ast-utils';
import { WorkspaceProject } from '@schematics/angular/utility/workspace-models';
import { getProjectFromWorkspace } from '../../utils/get-project';
import { getProjectMainFile } from '../../utils/get-project-main-file';
import { searchSubdirs } from '../../utils/search-subdirs';

import { Schema } from '../schema';
import { insertImport, isImported } from '@schematics/angular/utility/ast-utils';
import { Change, InsertChange, ReplaceChange } from '@schematics/angular/utility/change';
import { getProperties, propertyExists } from '../../utils/properties.util';
import { shouldSetFooter } from '../../utils/set-footer';
import { resolveJSONModule } from './resolve-json-module';
import { readStringFile } from '../../utils/read-file';
import { update } from '../../utils/update.util';

const VERSION_PROPERTY = 'version';
const PACKAGE = 'package.json';
const PACKAGE_VERSION = 'version';
const APP_COMPONENT = 'app.component.ts';
const FOOTER_SELECTOR = 'uoh-footer';

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
  const text = readStringFile(tree, path);

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

function addVersionInput(path: string, tree: Tree): void {
  const text = readStringFile(tree, path);

  if (text.includes(`<${FOOTER_SELECTOR}`)) {
    const start = text.indexOf(`<${FOOTER_SELECTOR}`);
    const end = text.indexOf('>', start);

    if (start > -1 && end > -1) {
      const oldText = text.substring(start, end);

      if (!oldText.includes('[version]')) {
        const newText = `${oldText} [version]="version"`;
        const changes = [new ReplaceChange(path, start, oldText, newText)];
        update(tree, path, changes);
      }
    }
  }
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

    const appComponentTemplate = appComponentPath.replace('ts', 'html');
    addVersionInput(appComponentTemplate, tree);

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
