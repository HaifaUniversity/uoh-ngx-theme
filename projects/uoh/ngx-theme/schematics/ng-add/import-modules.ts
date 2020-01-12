import { Rule, SchematicContext, Tree, SchematicsException } from '@angular-devkit/schematics';
import * as ts from 'typescript';
import { addImportToModule } from '@schematics/angular/utility/ast-utils';
import { buildRelativePath } from '@schematics/angular/utility/find-module';
import { InsertChange } from '@schematics/angular/utility/change';
import { Schema } from './schema';

/**
 * Add the import statement for the UohModule.
 * @param tree The schematics tree
 * @param uohModule The uoh module to import
 */
function addUohModuleImport(tree: Tree, uohModule: string) {
  const path = '/src/app/app.module.ts';
  const appModule = tree.read(path);
  if (!appModule) {
    throw new SchematicsException('Could not find the app.module.ts file');
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
    console.warn('Cannot add the theme modules to the app.module file', e);
  }
}

/**
 * Adds the import statements to the theme modules to the app module.
 * @param _options The options entered by the user in the cli.
 */
export function importModules(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    if (_options.header) {
      addUohModuleImport(tree, 'Header');
    }

    if (_options.footer) {
      addUohModuleImport(tree, 'Footer');
    }

    if (_options.spinner) {
      addUohModuleImport(tree, 'Spinner');
    }

    if (_options.backToTop) {
      addUohModuleImport(tree, 'BackToTop');
    }

    if (_options.accessibility) {
      addUohModuleImport(tree, 'Accessibility');
    } else {
      addUohModuleImport(tree, 'Body');
    }
    return tree;
  };
}
