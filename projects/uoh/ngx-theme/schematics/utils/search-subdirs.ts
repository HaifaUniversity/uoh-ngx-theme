import { Tree } from '@angular-devkit/schematics';

/**
 * Search for a target file in the subdirectories of a given directory path.
 * @param tree The schematics tree.
 * @param path The path for the current directory.
 * @param target The target file to search for.
 * @param maxLevels The maximum of subdirectories levels to search (to prevent infinite loops in recursion).
 * @param level The current level from the root directory.
 */
export function searchSubdirs(tree: Tree, path: string, target: string, maxLevels = 20, level = 0): string {
  try {
    const dir = tree.getDir(path);

    for (const item of dir.subdirs) {
      const subdir = dir.dir(item);
      let targetPath = `${subdir.path}/${target}`;

      if (tree.exists(targetPath)) {
        return targetPath;
      } else if (level < maxLevels) {
        // Search in the subdirs of the subdir for the target file (use the maximum levels to avoid infinite loops)
        targetPath = searchSubdirs(tree, subdir.path, target, maxLevels, level + 1);

        if (targetPath) {
          return targetPath;
        }
      }
    }
  } catch (e) {
    console.warn('Cannot search subfolders', e);
  }

  return '';
}
