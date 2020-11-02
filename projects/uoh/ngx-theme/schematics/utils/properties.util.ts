import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { find, findAll } from './find.util';

/**
 * Returns a list of properties in a typescript class file.
 * @param root The root node in the typescript file.
 */
export function getProperties(root: ts.Node): ts.Node[] {
  // Retrieve the root node where the class declaration is found in the ts file.
  const classDeclaration = find(root, ts.SyntaxKind.ClassDeclaration);

  if (!classDeclaration) {
    return [];
  }

  // Find all of SyntaxList children, inside one of them the property nodes can be found.
  const list = findAll(classDeclaration, ts.SyntaxKind.SyntaxList);

  // Reduce the above list to an array containing only the property nodes.
  return list.reduce((prev, curr) => [...prev, ...findAll(curr, ts.SyntaxKind.PropertyDeclaration)], []);
}

/**
 * Checks if a given property already exists in a list of property node.
 * @param properties The list of property nodes.
 * @param name The property name.
 */
export function propertyExists(properties: ts.Node[], name: string): boolean {
  for (const property of properties) {
    const identifier = property.getChildren().find((node) => node.kind === ts.SyntaxKind.Identifier);

    if (identifier?.getText() === name) {
      return true;
    }
  }

  return false;
}
