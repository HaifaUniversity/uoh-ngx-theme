import { Tree } from '@angular-devkit/schematics';
import { getWorkspace } from '../utils/config';
import { WorkspaceProject } from '@schematics/angular/utility/workspace-models';

import { getProjectTargetOptions } from './get-project-target-options';
import { getProjectFromWorkspace } from './get-project';

/**
 * Returns the path to the styles file from a list of file paths.
 * @param project The selected project.
 * @param buildTarget The build target to retrieve the styles path from.
 */
export function getStylesPathFromProject(project: WorkspaceProject, buildTarget = 'build'): string | undefined {
  let fallback: string | undefined = undefined;

  const buildOptions = getProjectTargetOptions(project, buildTarget);

  for (const item of buildOptions.styles) {
    if (item.includes('styles.scss')) {
      return item;
    } else if (!fallback && item.endsWith('.scss')) {
      fallback = item;
    }
  }

  return fallback;
}

export function getStylesPath(tree: Tree, projectName: string): string | undefined {
  const workspace = getWorkspace(tree);
  const project = getProjectFromWorkspace(workspace, projectName);

  return getStylesPathFromProject(project);
}
