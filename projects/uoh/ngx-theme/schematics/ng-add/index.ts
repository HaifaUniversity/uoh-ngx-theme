import { Tree, Rule, SchematicContext } from '@angular-devkit/schematics';
import { NodePackageInstallTask, RunSchematicTask } from '@angular-devkit/schematics/tasks';

import { Schema } from './schema';
import { getIndexPath } from '../utils/get-index';
import { Snapshot } from './models';
import { getStylesPath } from '../utils/get-styles';
import { readStringFile } from '../utils/read-file';

/**
 * Create a snapshot of some configuration files before the installation of material (to undo some of its schematics changes).
 * @param tree The schematics tree.
 * @param project The name of the selected project.
 */
function createSnapshot(tree: Tree, project: string): Snapshot {
  const indexPath = getIndexPath(tree, project);
  const index = readStringFile(tree, indexPath);

  const stylesPath = getStylesPath(tree, project);
  const styles = stylesPath ? readStringFile(tree, stylesPath) : '';

  return { index, styles };
}

/**
 * Angular ngAdd schematics that adds all the uoh-theme configurations.
 * @param _options The options entered by the user in the cli.
 */
export function ngAdd(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const snapshot = createSnapshot(tree, _options.project);
    const installMaterial = _context.addTask(new RunSchematicTask('ng-add-install-material', _options));
    const installTheme = _context.addTask(new NodePackageInstallTask(), [installMaterial]);

    _context.addTask(new RunSchematicTask('ng-add-setup-project', { ..._options, snapshot }), [installTheme]);
  };
}
