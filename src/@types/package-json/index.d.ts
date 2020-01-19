declare module 'package-json' {
  export interface Package {
    dependencies: { [name: string]: string };
  }
}
