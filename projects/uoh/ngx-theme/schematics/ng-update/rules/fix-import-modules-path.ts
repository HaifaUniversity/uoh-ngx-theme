import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';
import { getWorkspace } from '../../utils/config';
import { getAppModulePath } from '@schematics/angular/utility/ng-ast-utils';
import { getProjectFromWorkspace } from '../../utils/get-project';
import { getProjectMainFile } from '../../utils/get-project-main-file';
import { readStringFile } from '../../utils/read-file';

const RELATIVE_MODULES_IMPORT_REGEX = '((..){0,1}/)*node_modules/@uoh/ngx-theme';
const ABSOLUTE_MODULES_IMPORT = '@uoh/ngx-theme';

/**
 * Fixes the path to the imported uoh modules in the app.module.ts file.
 * It replaces a relative path containing the 'node_modules' folder with an absolute path.
 */
export function fixImportModulesPath(): Rule {
  return (tree: Tree, _context: SchematicContext): Tree => {
    const workspace = getWorkspace(tree);
    const project = getProjectFromWorkspace(workspace);
    const appModulePath = getAppModulePath(tree, getProjectMainFile(project));
    const text = readStringFile(tree, appModulePath);
    const badImports = text.match(RELATIVE_MODULES_IMPORT_REGEX);

    if (!!badImports && badImports.length > 0) {
      // Replace the relative path containing 'node_modules' with the absoule path.
      const fixText = text.replace(badImports[0], ABSOLUTE_MODULES_IMPORT);
      // Overwrite the app.module.ts file with the fixed path.
      tree.overwrite(appModulePath, fixText);
    }

    return tree;
  };
}
