import { Tree, Rule, SchematicContext } from '@angular-devkit/schematics';

export function updateToV5(_: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    context.logger.info('Updating the @uoh/ngx-theme');

    return host;
  };
}
