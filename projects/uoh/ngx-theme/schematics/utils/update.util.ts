import { Tree } from '@angular-devkit/schematics';
import { Change, applyToUpdateRecorder } from '@schematics/angular/utility/change';

/**
 * Commits the given changes to the given file.
 * @param tree The schematics tree.
 * @param path The path to the file to update.
 * @param changes The changes to perform to the file.
 */
export function update(tree: Tree, path: string, changes: Array<Change>): void {
  const recorder = tree.beginUpdate(path);
  applyToUpdateRecorder(recorder, changes);
  tree.commitUpdate(recorder);
}
