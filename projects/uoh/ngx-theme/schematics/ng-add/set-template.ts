import { Rule, SchematicContext, Tree, SchematicsException } from '@angular-devkit/schematics';
import { Schema } from './schema';

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
 * @param _options The options entered by the user in the cli.
 * @param template The template.
 */
function getComponents(_options: Schema, template: string): string {
  let components = '';

  if (_options.spinner) {
    components += getComponent(template, 'uoh-spinner');
  }

  if (_options.header) {
    components += getComponent(template, 'uoh-header', 'header="אוניברסיטת חיפה"');
  }

  if (_options.backToTop) {
    components += getComponent(template, 'uoh-back-to-top');
  }

  if (_options.footer) {
    components += getComponent(template, 'uoh-footer');
  }

  return components;
}

/**
 * Wraps the template with the uoh-accessibility or the uoh-body component.
 * @param _options The options entered by the user in the cli.
 * @param template The template.
 */
function wrap(_options: Schema, template: string): string {
  return _options.accessibility
    ? `<uoh-accessibility dir="${_options.dir}">\n${template}\n</uoh-accessibility>\n`
    : `<uoh-body>\n${template}\n</uoh-body>\n`;
}

/**
 * Schematic to add the components to the app html template.
 * @param _options The options entered by the user in the cli.
 */
export function setTemplate(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const indexFile = tree.read(_options.templatePath);
    if (!indexFile) {
      throw new SchematicsException(`Could not find the ${_options.templatePath} file`);
    }

    try {
      const template = indexFile.toString('utf-8');
      if (!hasComponent(template, 'uoh-accessibility') && !hasComponent(template, 'uoh-body')) {
        const components = getComponents(_options, template);
        const content = _options.clearTemplate ? `${components}\n` : `${components}\n\n${template}`;
        const updatedTemplate = wrap(_options, content);

        tree.overwrite(_options.templatePath, updatedTemplate);
      }
    } catch (e) {
      console.warn(`Cannot set the html tags in the ${_options.templatePath} file`, e);
    }

    return tree;
  };
}
