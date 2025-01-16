import util from 'node:util';

const debug = util.debuglog('gulp-dependencies');

export interface Package {
  dependencies: { [name: string]: string };
}

interface Requires {
  [name: string]: string;
}

interface Module {
  requires?: Requires;
}

export interface Dependencies {
  [name: string]: Module;
}

interface PackageLock1 {
  dependencies: Dependencies;
}

interface PackageLock2 {
  packages: Dependencies;
}

export type PackageLock = PackageLock1 | PackageLock2;

export default function resolver(dictionary: Dependencies, mapper = Array.prototype.flatMap) {
  const dependencySet = new Set<string>();
  return function resolve(name: string) {
    dependencySet.add(name);
    const module = dictionary[name];
    const requires = module?.requires && Object.keys(module.requires);
    debug(`${name}: ${requires}`);
    return [name].concat(
      requires
        ? mapper.call<string[], any[], string[]>(requires.filter(id => !dependencySet.has(id)), resolve)
        : [],
    );
  };
}
