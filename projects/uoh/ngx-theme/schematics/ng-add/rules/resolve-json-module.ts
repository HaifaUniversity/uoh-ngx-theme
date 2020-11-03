import { Rule, SchematicsException, SchematicContext, Tree } from '@angular-devkit/schematics';
import { parseJson, JsonParseMode } from '@angular-devkit/core';

const TSCONFIG_BASE_PATH = 'tsconfig.base.json';
const TSCONFIG_PATH = 'tsconfig.json';

function readBaseTsconfig(tree: Tree): Buffer | null {
  try {
    return tree.read(TSCONFIG_BASE_PATH);
  } catch (e) {}

  return null;
}

function readTsconfig(tree: Tree): Buffer | null {
  const source = readBaseTsconfig(tree);

  return !!source ? source : tree.read(TSCONFIG_PATH);
}

export function resolveJSONModule(): Rule {
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
