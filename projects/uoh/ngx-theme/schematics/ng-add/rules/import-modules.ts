import { Rule, SchematicContext, Tree, SchematicsException } from '@angular-devkit/schematics';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { addImportToModule } from '@schematics/angular/utility/ast-utils';
import { getAppModulePath } from '@schematics/angular/utility/ng-ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';
import { getWorkspace } from '../../utils/config';
import { Schema } from '../schema';
import { getProjectFromWorkspace } from '../../utils/get-project';
import { getProjectMainFile } from '../../utils/get-project-main-file';
import { hasNgModuleImport } from '../../utils/ng-module-imports';

/** Name of the Angular module that enables Angular browser animations. */
const browserAnimationsModuleName = 'BrowserAnimationsModule';

/** Name of the module that switches Angular animations to a noop implementation. */
const noopAnimationsModuleName = 'NoopAnimationsModule';

/**
 * Add the import statement for the UohModule.
 * @param tree The schematics tree
 * @param path The path to the module importing the uoh module
 * @param uohModule The uoh module to import
 */
function addUohModuleImport(tree: Tree, path: string, uohModule: string) {
  addNgModuleImport(tree, path, '@uoh/ngx-theme', `Uoh${uohModule}Module`);
}

/**
 * Imports a module into the NgModule imports metadata.
 * @param tree The schematics tree
 * @param path The path to the module importing the module
 * @param modulePath The path to the module to import
 * @param classifiedName The classified name for the module
 */
function addNgModuleImport(tree: Tree, path: string, modulePath: string, classifiedName: string) {
  const appModule = tree.read(path);
  if (!appModule) {
    throw new SchematicsException(`Could not find the ${path} file`);
  }

  try {
    const text = appModule.toString('utf-8');

    if (!text.includes(classifiedName)) {
      const source = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true);
      const changes = addImportToModule(source, path, classifiedName, modulePath);

      const recorder = tree.beginUpdate(path);
      for (const change of changes) {
        if (change instanceof InsertChange) {
          recorder.insertLeft(change.pos, change.toAdd);
        }
      }

      tree.commitUpdate(recorder);
    }
  } catch (e) {
    console.warn(`Cannot add the ${classifiedName} module to the ${path} file`, e);
  }
}

/**
 * Adds the import statements to the theme modules to the app module.
 * @param options The options entered by the user in the cli.
 */
export function importModules(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const workspace = getWorkspace(tree);
    const project = getProjectFromWorkspace(workspace, options.project);
    const appModulePath = getAppModulePath(tree, getProjectMainFile(project));

    if (options.animations) {
      // In case the project explicitly uses the NoopAnimationsModule, we should print a warning
      // message that makes the user aware of the fact that we won't automatically set up
      // animations. If we would add the BrowserAnimationsModule while the NoopAnimationsModule
      // is already configured, we would cause unexpected behavior and runtime exceptions.
      if (hasNgModuleImport(tree, appModulePath, noopAnimationsModuleName)) {
        context.logger.error(
          `Could not set up "${browserAnimationsModuleName}" ` +
            `because "${noopAnimationsModuleName}" is already imported.`
        );
        context.logger.info(`Please manually set up browser animations.`);
        return;
      }

      addNgModuleImport(tree, appModulePath, '@angular/platform-browser/animations', browserAnimationsModuleName);
    } else if (!hasNgModuleImport(tree, appModulePath, browserAnimationsModuleName)) {
      // Do not add the NoopAnimationsModule module if the project already explicitly uses
      // the BrowserAnimationsModule.
      addNgModuleImport(tree, appModulePath, '@angular/platform-browser/animations', noopAnimationsModuleName);
    }

    if (options.header) {
      addUohModuleImport(tree, appModulePath, 'Header');
    }

    if (options.footer) {
      addUohModuleImport(tree, appModulePath, 'Footer');
    }

    if (options.spinner) {
      addUohModuleImport(tree, appModulePath, 'Spinner');
    }

    if (options.backToTop) {
      addUohModuleImport(tree, appModulePath, 'BackToTop');
    }

    if (options.accessibility) {
      addUohModuleImport(tree, appModulePath, 'Accessibility');
    } else {
      addUohModuleImport(tree, appModulePath, 'Body');
    }
    return tree;
  };
}
