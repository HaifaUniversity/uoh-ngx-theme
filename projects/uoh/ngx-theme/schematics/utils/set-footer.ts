import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { Tree, SchematicsException } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/config';
import { getAppModulePath } from '@schematics/angular/utility/ng-ast-utils';
import { getProjectFromWorkspace } from './get-project';
import { getProjectMainFile } from './get-project-main-file';
import { isImported } from '@schematics/angular/utility/ast-utils';
import { Schema } from '../ng-add/schema';

export function isFooterImported(tree: Tree, projectName?: string): boolean {
  const workspace = getWorkspace(tree);
  const project = getProjectFromWorkspace(workspace, projectName);
  const appModulePath = getAppModulePath(tree, getProjectMainFile(project));

  try {
    const source = tree.read(appModulePath);

    if (!source) {
      throw new SchematicsException(`Cannot find the app.module.`);
    }

    const text = source.toString('utf-8');

    const root = ts.createSourceFile(appModulePath, text, ts.ScriptTarget.Latest, true);

    return isImported(root, 'UohFooterModule', '@uoh/ngx-theme');
  } catch (e) {
    console.warn('Could not determine if the footer exists.');
  }

  return false;
}

export function shouldSetFooter(tree: Tree, options?: Schema): boolean {
  return !!options ? options.footer : isFooterImported(tree);
}
