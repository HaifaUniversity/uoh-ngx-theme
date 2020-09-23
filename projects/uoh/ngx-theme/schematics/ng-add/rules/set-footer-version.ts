import { Rule, Tree, SchematicContext, SchematicsException } from '@angular-devkit/schematics';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { getWorkspace } from '@schematics/angular/utility/config';
import { getAppModulePath } from '@schematics/angular/utility/ng-ast-utils';
import { WorkspaceProject } from '@angular-devkit/core/src/experimental/workspace';
import { getProjectFromWorkspace } from '../../utils/get-project';
import { getProjectMainFile } from '../../utils/get-project-main-file';

import { Schema } from '../schema';
import { insertImport } from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';

function getAppComponentPath(tree: Tree, project: WorkspaceProject) {
  const appModulePath = getAppModulePath(tree, getProjectMainFile(project));

  return appModulePath.replace('module', 'component');
}

export function setFooterVersion(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const workspace = getWorkspace(tree);
    const project = getProjectFromWorkspace(workspace, options.project);
    const appComponentPath = getAppComponentPath(tree, project);

    const appComponent = tree.read(appComponentPath);
    if (!appComponent) {
      throw new SchematicsException(`Could not find the ${appComponentPath} file`);
    }

    const classifiedName = 'version';
    const modulePath = 'package.json';

    try {
      const text = appComponent.toString('utf-8');

      if (!text.includes(classifiedName)) {
        const source = ts.createSourceFile(appComponentPath, text, ts.ScriptTarget.Latest, true);
        const change = insertImport(source, appComponentPath, classifiedName, modulePath);

        const recorder = tree.beginUpdate(appComponentPath);
        if (change instanceof InsertChange) {
          recorder.insertLeft(change.pos, change.toAdd);
        }

        tree.commitUpdate(recorder);
      }
    } catch (e) {
      console.warn(`Cannot add the ${classifiedName} module to the ${appComponentPath} file`, e);
    }
  };
}
