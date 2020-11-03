import { Tree, SchematicsException } from '@angular-devkit/schematics';

/**
 * Returns the contents of the given file as utf-8 string.
 * @param tree The schematics tree.
 * @param path The path to the file.
 */
export function readStringFile(tree: Tree, path: string): string {
  const source = tree.read(path);
  if (!source) {
    throw new SchematicsException(`Could not find the ${path} file`);
  }

  return source.toString('utf-8');
}
