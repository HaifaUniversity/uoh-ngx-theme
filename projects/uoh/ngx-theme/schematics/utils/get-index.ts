import { Tree } from '@angular-devkit/schematics';
import { getWorkspace } from '../utils/config';
import { getProjectFromWorkspace } from './get-project';
import { getProjectTargetOptions } from './get-project-target-options';

export function getIndexPath(tree: Tree, projectName?: string): string {
  const workspace = getWorkspace(tree);
  const project = getProjectFromWorkspace(workspace, projectName);
  const buildOptions = getProjectTargetOptions(project, 'build');

  return buildOptions.index;
}
