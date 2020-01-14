import { Tree, SchematicsException } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/config';
import { getProjectFromWorkspace } from './get-project';
import { getProjectTargetOptions } from './get-project-target-options';

export function getIndexPath(tree: Tree, projectName: string): string {
  const workspace = getWorkspace(tree);
  const project = getProjectFromWorkspace(workspace, projectName);
  const buildOptions = getProjectTargetOptions(project, 'build');

  return buildOptions.index;
}

export function getIndex(tree: Tree, indexPath: string): Buffer {
  const indexFile = tree.read(indexPath);
  if (!indexFile) {
    throw new SchematicsException(`Could not find the index file`);
  }

  return indexFile;
}

export function readIndex(tree: Tree, indexPath: string): string {
  const indexFile = getIndex(tree, indexPath);

  return indexFile.toString('utf-8');
}
