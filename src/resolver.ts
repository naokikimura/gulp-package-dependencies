import { Dependencies } from 'package-lock-json';
import util from 'util';

const debug = util.debuglog('gulp-dependencies');

export default function resolver(dictionary: Dependencies, mapper = Array.prototype.flatMap) {
  const dependencySet = new Set<string>();
  return function resolve(name: string) {
    dependencySet.add(name);
    const module = dictionary[name];
    const requires = module && module.requires && Object.keys(module.requires);
    debug(`${name}: ${requires}`);
    return [name].concat(
      requires
        ? mapper.call<string[], any[], string[]>(requires.filter(id => !dependencySet.has(id)), resolve)
        : [],
    );
  };
}
