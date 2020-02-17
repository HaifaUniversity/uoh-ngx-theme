import { Rule, SchematicContext, Tree, SchematicsException } from '@angular-devkit/schematics';
import { Schema } from '../schema';
import { getWorkspace } from '@schematics/angular/utility/config';
import { getProjectFromWorkspace } from '../../utils/get-project';
import { getAppModulePath } from '@schematics/angular/utility/ng-ast-utils';
import { getProjectMainFile } from '../../utils/get-project-main-file';
import { searchSubdirs } from '../../utils/search-subdirs';

/**
 * Checks if the component exists in the template.
 * @param template The template.
 * @param selector The selector for the component.
 */
function hasComponent(template: string, selector: string): boolean {
  return template.includes(`<${selector}`);
}

/**
 * Returns the selector tags of the component if it does not exist in the template.
 * @param template The template.
 * @param selector The selector for the component.
 * @param attribs Attributes for the component.
 */
function getComponent(template: string, selector: string, attribs = ''): string {
  if (!hasComponent(template, selector)) {
    attribs = attribs ? ` ${attribs}` : '';

    return `<${selector}${attribs}></${selector}>\n`;
  }

  return '';
}

/**
 * Returns a string containing the uoh components selector tags.
 * @param options The options entered by the user in the cli.
 * @param template The template.
 */
function getComponents(options: Schema, template: string): string {
  let components = '';

  if (options.spinner) {
    components += getComponent(template, 'uoh-spinner');
  }

  if (options.header) {
    components += getComponent(template, 'uoh-header', 'header="אוניברסיטת חיפה"');
  }

  if (options.backToTop) {
    components += getComponent(template, 'uoh-back-to-top');
  }

  if (options.footer) {
    components += getComponent(template, 'uoh-footer');
  }

  return components;
}

/**
 * Wraps the template with the uoh-accessibility or the uoh-body component.
 * @param options The options entered by the user in the cli.
 * @param template The template.
 */
function wrap(options: Schema, template: string): string {
  return options.accessibility
    ? `<uoh-accessibility dir="${options.dir}">\n${template}\n</uoh-accessibility>\n`
    : `<uoh-body>\n${template}\n</uoh-body>\n`;
}

/**
 * Get the path for the template file in which the uoh components will be added.
 * @param tree The schematics tree.
 * @param options The options entered by the user in the cli.
 */
function getTemplatePath(tree: Tree, options: Schema): string {
  if (options.templatePath) {
    // The user set a custom path for the template in the cli.
    return options.templatePath;
  }

  try {
    const workspace = getWorkspace(tree);
    const project = getProjectFromWorkspace(workspace, options.project);
    const appModulePath = getAppModulePath(tree, getProjectMainFile(project));
    const dirPath = appModulePath.substring(0, appModulePath.lastIndexOf('/'));
    const path = `${dirPath}/app.component.html`;

    if (tree.exists(path)) {
      // The app.component.html file is in the same path as the app.module.
      return path;
    } else {
      // Try to find in the subdirs.
      return searchSubdirs(tree, path, 'app.component.html');
    }
  } catch (e) {
    console.warn(`Cannot get the default app template file`, e);
  }

  return '';
}

/**
 * Schematic to add the components to the app html template.
 * @param options The options entered by the user in the cli.
 */
export function setTemplate(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const templatePath = getTemplatePath(tree, options);
    if (!templatePath) {
      throw new SchematicsException(`Could not find the template file`);
    }

    const templateFile = tree.read(templatePath);
    if (!templateFile) {
      throw new SchematicsException(`Could not find the ${templatePath} file`);
    }

    try {
      const template = templateFile.toString('utf-8');
      if (!hasComponent(template, 'uoh-accessibility') && !hasComponent(template, 'uoh-body')) {
        const components = getComponents(options, template);
        const content = options.clearTemplate ? `${components}\n` : `${components}\n\n${template}`;
        const updatedTemplate = wrap(options, content);

        tree.overwrite(templatePath, updatedTemplate);
      }
    } catch (e) {
      console.warn(`Cannot set the html tags in the ${templatePath} file`, e);
    }

    return tree;
  };
}
