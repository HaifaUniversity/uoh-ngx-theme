import { Rule } from '@angular-devkit/schematics';
import { getWorkspacePath } from '@schematics/angular/utility/config';
import { WorkspaceSchema } from '@schematics/angular/utility/workspace-models';

export function updateWorkspace(workspace: WorkspaceSchema): Rule {
  return (host) => {
    host.overwrite(getWorkspacePath(host), JSON.stringify(workspace, null, 2));
  };
}
