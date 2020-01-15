import { Tree, SchematicsException } from '@angular-devkit/schematics';

/**
 * Returns the contents of the given file as utf-8 string.
 * @param tree The schematics tree.
 * @param stylesPath The path to the file.
 */
export function readStringFile(tree: Tree, path: string): string {
  const stylesFile = tree.read(path);
  if (!stylesFile) {
    throw new SchematicsException(`Could not find the ${path} file`);
  }

  return stylesFile.toString('utf-8');
}
