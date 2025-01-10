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

  export interface PackageLock1 {
    dependencies: Dependencies;
  }

  export interface PackageLock2 {
    packages: Dependencies;
  }

  export type PackageLock = PackageLock1 | PackageLock2;
}
