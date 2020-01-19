declare module 'package-lock-json' {
  export interface Requires {
    [name: string]: string;
  }

  export interface Module {
    requires?: Requires;
  }

  export interface Dependencies {
    [name: string]: Module;
  }

  export interface PackageLock {
    dependencies: Dependencies;
  }
}
