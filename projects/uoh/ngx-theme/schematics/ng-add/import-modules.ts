import { Rule, SchematicContext, Tree, SchematicsException } from '@angular-devkit/schematics';
import * as ts from 'typescript';
import { addImportToModule } from '@schematics/angular/utility/ast-utils';
import { getAppModulePath } from '@schematics/angular/utility/ng-ast-utils';
import { buildRelativePath } from '@schematics/angular/utility/find-module';
import { InsertChange } from '@schematics/angular/utility/change';
import { getWorkspace } from '@schematics/angular/utility/config';
import { Schema } from './schema';
import { getProjectFromWorkspace } from '../utils/get-project';
import { getProjectMainFile } from '../utils/get-project-main-file';

/**
 * Add the import statement for the UohModule.
 * @param tree The schematics tree
 * @param path The path to the module importing the uoh module
 * @param uohModule The uoh module to import
 */
function addUohModuleImport(tree: Tree, path: string, uohModule: string) {
  const appModule = tree.read(path);
  if (!appModule) {
    throw new SchematicsException(`Could not find the ${path} file`);
  }

  try {
    const text = appModule.toString('utf-8');
    const classifiedName = `Uoh${uohModule}Module`;

    if (!text.includes(classifiedName)) {
      const source = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true);
      const relativePath = buildRelativePath(path, '/node_modules/@uoh/ngx-theme');
      const changes = addImportToModule(source, path, classifiedName, relativePath);

      const recorder = tree.beginUpdate(path);
      for (const change of changes) {
        if (change instanceof InsertChange) {
          recorder.insertLeft(change.pos, change.toAdd);
        }
      }

      tree.commitUpdate(recorder);
    }
  } catch (e) {
    console.warn(`Cannot add the theme modules to the ${path} file`, e);
  }
}

/**
 * Adds the import statements to the theme modules to the app module.
 * @param _options The options entered by the user in the cli.
 */
export function importModules(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const workspace = getWorkspace(tree);
    const project = getProjectFromWorkspace(workspace, _options.project);
    const appModulePath = getAppModulePath(tree, getProjectMainFile(project));

    if (_options.header) {
      addUohModuleImport(tree, appModulePath, 'Header');
    }

    if (_options.footer) {
      addUohModuleImport(tree, appModulePath, 'Footer');
    }

    if (_options.spinner) {
      addUohModuleImport(tree, appModulePath, 'Spinner');
    }

    if (_options.backToTop) {
      addUohModuleImport(tree, appModulePath, 'BackToTop');
    }

    if (_options.accessibility) {
      addUohModuleImport(tree, appModulePath, 'Accessibility');
    } else {
      addUohModuleImport(tree, appModulePath, 'Body');
    }
    return tree;
  };
}
