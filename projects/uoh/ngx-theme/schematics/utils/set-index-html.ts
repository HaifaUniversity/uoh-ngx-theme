import { Tree } from '@angular-devkit/schematics';

import { getIndexPath } from './get-index';
import { readStringFile } from './read-file';

function getHead(html: string): string | undefined {
  const matches = html.match(/<head>[\s\S]*<\/head>/gm);

  return matches && matches.length > 0 ? matches[0] : undefined;
}

function getMissingTags(html: string, attribs: Array<string>): Array<string> {
  const minified = html.replace(/[\t\n\r]+/gm, '');
  const singleSpace = minified.replace(/ {2,}/gm, ' ');
  const corrected = singleSpace.replace(/ {0,}\/>/gm, '>');

  return attribs.filter((attrib) => !corrected.includes(attrib));
}

function addToHead(head: string, tags: Array<string>): string {
  const additions = tags.reduce((prev, curr) => `${prev}\n\t\t${curr}`);
  const end = head.indexOf('</head>');
  const before = head.substring(0, end);
  const after = head.substring(end);

  return `${before}\t${additions}\n\t${after}`;
}

function addIndexHtmlTags(tree: Tree, indexPath: string, html: string): void {
  const attribs = [
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />',
    '<meta http-equiv="X-UA-Compatible" content="IE=edge">',
    '<meta name="mobile-web-app-capable" content="yes">',
    '<meta name="apple-mobile-web-app-capable" content="yes">',
    '<meta name="theme-color" content="#0664AA">',
    '<link href="https://fonts.googleapis.com/css?family=Rubik:400,700&display=swap" rel="stylesheet">',
    '<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">',
  ];

  const head = getHead(html);
  if (!head) {
    throw Error(`Could not find '<head>' element in HTML file: ${indexPath}`);
  }

  const missing = getMissingTags(head, attribs);

  if (missing.length > 0) {
    const newHead = addToHead(head, missing);
    const content = html.replace(head, newHead);

    tree.overwrite(indexPath, content);
  }
}

export function setIndexHtml(tree: Tree, project?: string): void {
  const indexPath = getIndexPath(tree, project);
  const html = readStringFile(tree, indexPath);

  addIndexHtmlTags(tree, indexPath, html);
}
