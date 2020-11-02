import { Rule, SchematicsException, SchematicContext, Tree } from '@angular-devkit/schematics';
import { parseJson, JsonParseMode } from '@angular-devkit/core';
import { Schema } from '../schema';

const TSCONFIG_PATH = 'tsconfig.base.json';
const TSCONFIG_FALLBACK_PATH = 'tsconfig.json';

function readTsconfig(tree: Tree): Buffer | null {
  const source = tree.read(TSCONFIG_PATH);

  if (!source) {
    return tree.read(TSCONFIG_FALLBACK_PATH);
  }

  return source;
}

export function resolveJSONModule(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext): Tree => {
    const source = readTsconfig(tree);

    if (!source) {
      throw new SchematicsException(`The tsconfig file could not be found.`);
    }

    const text = source.toString();
    const config = parseJson(text, JsonParseMode.Loose) as any;

    if (!config) {
      throw new SchematicsException('The tsconfig file is empty.');
    }

    if (!config['compilerOptions']) {
      config['compilerOptions'] = {};
    }

    config['compilerOptions']['resolveJsonModule'] = true;

    tree.overwrite(TSCONFIG_PATH, JSON.stringify(config, undefined, 2));

    return tree;
  };
}
