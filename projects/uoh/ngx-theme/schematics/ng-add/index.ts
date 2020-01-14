import { Tree, Rule, SchematicContext } from '@angular-devkit/schematics';
import { NodePackageInstallTask, RunSchematicTask } from '@angular-devkit/schematics/tasks';

import { Schema } from './schema';
import { getIndexPath, readIndex } from '../utils/get-index';

/**
 * Angular ngAdd schematics that adds all the uoh-theme configurations.
 * @param _options The options entered by the user in the cli.
 */
export function ngAdd(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    // Take a snapshot of the index.html and the styles files before installing material.
    const indexPath = getIndexPath(tree, _options.project);
    const index = readIndex(tree, indexPath);
    const styles = '';

    const installMaterial = _context.addTask(new RunSchematicTask('ng-add-install-material', _options));
    const installTheme = _context.addTask(new NodePackageInstallTask(), [installMaterial]);

    _context.addTask(new RunSchematicTask('ng-add-setup-project', { ..._options, snapshot: { index, styles } }), [
      installTheme
    ]);
  };
}
