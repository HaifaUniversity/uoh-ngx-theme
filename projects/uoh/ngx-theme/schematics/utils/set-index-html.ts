import { Tree } from '@angular-devkit/schematics';
import {
  Change,
  InsertChange,
  RemoveChange,
  ReplaceChange,
  applyToUpdateRecorder,
} from '@schematics/angular/utility/change';

import { getIndexPath } from './get-index';
import { readStringFile } from './read-file';

/**
 * A class that represents the head tag in the html file.
 */
class HeadTag {
  constructor(public start: number, public end: number, public content: string) {}
}

/**
 * A class that represents a head attribute in the html file.
 */
class HeadAttrib {
  constructor(public indentifier: string, public content: string) {}

  /**
   * Retrieves the content as a html tag.
   */
  public getHtml(): string {
    return `<${this.content}>`;
  }
}

/**
 * The viewport head attribute to add.
 */
const VIEWPORT_ATTRIB = new HeadAttrib(
  'meta name="viewport"',
  'meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"'
);

/**
 * The font attribute to add.
 */
const FONT_ATTRIB = new HeadAttrib(
  'link href="https://fonts.googleapis.com/css?family=Rubik',
  'link href="https://fonts.googleapis.com/css?family=Rubik:400,700&display=swap" rel="stylesheet"'
);

/**
 * The attributes to add to the head.
 */
const INSERT_ATTRIBS: Array<HeadAttrib> = [
  VIEWPORT_ATTRIB,
  new HeadAttrib('meta http-equiv="X-UA-Compatible"', 'meta http-equiv="X-UA-Compatible" content="IE=edge"'),
  new HeadAttrib('meta name="mobile-web-app-capable"', 'meta name="mobile-web-app-capable" content="yes"'),
  new HeadAttrib('meta name="apple-mobile-web-app-capable"', 'meta name="apple-mobile-web-app-capable" content="yes"'),
  new HeadAttrib('meta name="theme-color"', 'meta name="theme-color" content="#0664AA"'),
  new HeadAttrib(
    'link href="https://fonts.googleapis.com/icon?family=Material+Icons"',
    'link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"'
  ),
  FONT_ATTRIB,
];

/**
 * The attributes that need to be replaced in the head.
 */
const REPLACE_ATTRIBS: Array<HeadAttrib> = [
  new HeadAttrib('meta name="viewport"', VIEWPORT_ATTRIB.content),
  new HeadAttrib('link href="https://fonts.googleapis.com/css?family=Roboto', FONT_ATTRIB.content),
];

/**
 * The attributes that need to be removed from the head.
 */
const REMOVE_ATTRIBS: Array<HeadAttrib> = [];

/**
 * Inserts attributes required by the theme into the head of the given html file.
 * @param tree The schematics tree.
 * @param path The path to the html file.
 */
export function insertHeadAttribs(tree: Tree, path: string): Array<InsertChange> {
  const head = getHead(tree, path);
  const changes: Array<InsertChange> = [];
  for (const tag of INSERT_ATTRIBS) {
    const pos = head.content.indexOf(`<${tag.indentifier}`, head.start);

    if (pos === -1) {
      changes.push(new InsertChange(path, head.end, `${tag.getHtml()}\n\t`));
    }
  }

  return changes;
}

/**
 * Replaces old attributes in the head of the html file with the new ones required by the theme.
 * @param tree The schematics tree.
 * @param path The path to the html file.
 */
export function replaceHeadAttribs(tree: Tree, path: string): Array<ReplaceChange> {
  const head = getHead(tree, path);
  const changes: Array<ReplaceChange> = [];
  for (const tag of REPLACE_ATTRIBS) {
    const startPos = head.content.indexOf(`<${tag.indentifier}`, head.start);

    if (startPos > -1) {
      const endPos = head.content.indexOf('>', startPos);

      if (endPos > -1) {
        const oldText = head.content.substring(startPos, endPos + 1);
        changes.push(new ReplaceChange(path, startPos, oldText, tag.getHtml()));
      }
    }
  }

  return changes;
}

/**
 * Removes attributes that are not longer required in the head of the html file.
 * @param tree The schematics tree.
 * @param path The path to the html file.
 */
export function removeHeadAttribs(tree: Tree, path: string): Array<RemoveChange> {
  const head = getHead(tree, path);
  const changes: Array<RemoveChange> = [];
  for (const tag of REMOVE_ATTRIBS) {
    const pos = head.content.indexOf(`<${tag.indentifier}`, head.start);

    if (pos === -1) {
      changes.push(new RemoveChange(path, head.end, `${tag.getHtml()}`));
    }
  }

  return changes;
}

export function getHead(tree: Tree, path: string): HeadTag {
  const content = readStringFile(tree, path);

  const start = content.indexOf('<head>');
  const end = content.indexOf('</head>');

  return new HeadTag(start, end, content);
}

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

/**
 * Sets the required attributes in the index.html file.
 * @param tree The schematics tree.
 * @param project The project name (optional). If missing, the default project will be retrieved.
 */
export function setIndexHtml(tree: Tree, project?: string): void {
  const path = getIndexPath(tree, project);

  update(tree, path, replaceHeadAttribs(tree, path));
  update(tree, path, removeHeadAttribs(tree, path));
  update(tree, path, insertHeadAttribs(tree, path));
}
