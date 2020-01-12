export interface Schema {
  accessibility: boolean;
  header: boolean;
  footer: boolean;
  spinner: boolean;
  backToTop: boolean;
  clearTemplate: boolean;
  modulePath: string;
  configPath: string;
  indexPath: string;
  stylesPath: string;
  templatePath: string;
  dir: 'ltr' | 'rtl';
}
