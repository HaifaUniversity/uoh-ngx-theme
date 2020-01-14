export interface Schema {
  project: string;
  accessibility: boolean;
  header: boolean;
  footer: boolean;
  spinner: boolean;
  backToTop: boolean;
  clearTemplate: boolean;
  templatePath: string;
  dir: 'ltr' | 'rtl';
}
