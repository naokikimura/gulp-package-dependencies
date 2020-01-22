/// <reference types="./@types/package-lock-json" />
/// <reference types="./@types/package-json" />

import fs from 'fs';
import gulp from 'gulp';
import { Package } from 'package-json';
import { PackageLock } from 'package-lock-json';
import path from 'path';
import util from 'util';
import resolver from './resolver';

const debug = util.debuglog('gulp-dependencies');

interface Options {
  excludes: (name: string) => boolean;
  glob: (name: string) => string;
  folder: string;
  options: any;
  package: Package;
  packageLock: PackageLock;
}

const defaultOptions: Options = {
  excludes: () => true,
  glob: name => '**/*',
  folder: 'node_modules',
  options: {},
  package: JSON.parse(fs.readFileSync('./package.json', { encoding: 'UTF-8' })),
  packageLock: JSON.parse(fs.readFileSync('./package-lock.json', { encoding: 'UTF-8' })),
};

export = function dependencies(options = defaultOptions) {
  debug(`options = ${util.inspect(options)}`);
  const opts = Object.assign({}, defaultOptions, options);
  debug(`opts = ${util.inspect(opts)}`);
  return gulp.src(
    Array.prototype.flatMap.call<string[], any[], string[]>(
      Object.keys(opts.package.dependencies),
      resolver(opts.packageLock.dependencies, Array.prototype.flatMap),
    )
      .filter(opts.excludes)
      .map(name => path.join(opts.folder, name, opts.glob(name)))
      .concat(opts.folder),
    Object.assign({ base: opts.folder }, opts.options),
  );
};
