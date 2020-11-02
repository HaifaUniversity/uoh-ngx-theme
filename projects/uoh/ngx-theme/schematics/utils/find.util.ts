import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

/**
 * Finds the first node corresponding to the given kind.
 * @param parent The parent node.
 * @param kind The kind of the node to find.
 */
export function find(parent: ts.Node, kind: ts.SyntaxKind): ts.Node | undefined {
  if (parent.kind === kind) {
    return parent;
  }

  for (const child of parent.getChildren()) {
    const found = find(child, kind);

    if (!!found) {
      return found;
    }
  }

  return undefined;
}

/**
 * Finds all the children of a given kind in a parent node.
 * @param parent The parent node in the typescript file.
 * @param kind The kind of node to find.
 */
export function findAll(parent: ts.Node, kind: ts.SyntaxKind): ts.Node[] {
  return parent.getChildren().filter((node) => node.kind === kind);
}
