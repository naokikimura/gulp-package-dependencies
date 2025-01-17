import util from 'node:util';

const debug = util.debuglog('gulp-dependencies');

interface Dependencies {
  [name: string]: string;
}

export interface PackageFile {
  name?: string;
  version?: string;
  description?: string;
  keywords?: string[];
  homepage?: string;
  dependencies?: Dependencies;
  devDependencies?: Dependencies;
  private?: boolean;
}

export interface PackageLockFile1 {
  name: string;
  version: string;
  lockfileVersion: 1;
  dependencies: { [name: string]: Dependency; };
}

interface Dependency {
  version: string;
  resolved: string;
  integrity: string;
  bundled?: boolean;
  dev?: boolean;
  optional?: boolean;
  requires?: Dependencies;
  dependencies?: PackageLockFile1['dependencies'];
}

export interface PackageLockFile3 {
  name: string;
  version: string;
  lockfileVersion: 3;
  packages: { [name: string]: Package };
}

interface Package {
  version: string;
  resolved: string;
  integrity: string;
  link?: boolean;
  dev?: boolean;
  optional?: boolean;
  devOptional?: boolean;
  inBundle?: boolean;
  hasInstallScript?: boolean;
  hasShrinkwrap?: boolean;
  bin?: string | Record<string, string>;
  license?: string | Record<string, string>;
  engines?: Record<string, string>;
  dependencies?: Dependencies;
  optionalDependencies?: Dependencies;
}

export type PackageLockFile2 = {
  lockfileVersion: 2;
} | Omit<PackageLockFile1, "locaklockfileVersion"> | Omit<PackageLockFile3, "locaklockfileVersion">;

export type PackageLockFile = PackageLockFile1 | PackageLockFile2 | PackageLockFile3;

export default function resolver(packageLockFile: PackageLockFile, mapper = Array.prototype.flatMap) {
  const dependencySet = new Set<string>();
  const dependencies = 'dependencies' in packageLockFile ? packageLockFile.dependencies : {};
  const packages = 'packages' in packageLockFile ? packageLockFile.packages : {};
  return function resolve(name: string): string[] {
    dependencySet.add(name);

    const requires = [
      dependencies[name]?.requires,
      packages[name]?.dependencies,
    ].filter((dependencies) => dependencies !== undefined).map(Object.keys).flat();
    debug(`${name}: ${requires}`);

    return [name].concat(
      requires
        ? mapper.call<typeof requires, [typeof resolve], typeof requires>(
          requires.filter(id => !dependencySet.has(id)),
          resolve,
        )
        : [],
    ).concat([]);
  };
}
