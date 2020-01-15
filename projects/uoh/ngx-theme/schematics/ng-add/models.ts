export interface Asset {
  glob: string;
  input: string;
  output: string;
}

export interface Config {
  options: {
    assets: Array<string | Asset>;
    styles: Array<string>;
    stylePreprocessorOptions?: {
      includePaths?: Array<string>;
    };
  };
}

export interface Snapshot {
  index: string;
  styles: string;
}
