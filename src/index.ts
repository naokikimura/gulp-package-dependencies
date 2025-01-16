import gulp from 'gulp';
import fs, { PathOrFileDescriptor } from 'node:fs';
import path from 'path';
import util from 'util';
import resolver, { PackageFile, PackageLockFile } from './resolver.js';

const debug = util.debuglog('gulp-dependencies');

export interface Options {
  excludes: (name: string) => boolean;
  folder: string;
  glob: (name: string) => string;
  options: Parameters<typeof gulp.src>[1];
  package: PathOrFileDescriptor;
  packageLock: PathOrFileDescriptor;
}

const defaultOptions: Options = {
  excludes: () => true,
  folder: 'node_modules',
  glob: name => '**/*',
  options: undefined,
  package: './package.json',
  packageLock: './package-lock.json',
};

export default function dependencies(options = defaultOptions): ReturnType<typeof gulp.src> {
  debug(`options = ${util.inspect(options)}`);
  const opts = Object.assign({}, defaultOptions, options);
  debug(`opts = ${util.inspect(opts)}`);
  const packageFile: PackageFile = JSON.parse(fs.readFileSync(opts.package, { encoding: 'utf8' }));
  const packageLockFile: PackageLockFile = JSON.parse(fs.readFileSync(opts.packageLock, { encoding: 'utf8' }));

  return gulp.src(
    listDependencies(packageFile, packageLockFile, opts),
    Object.assign({ base: opts.folder }, opts.options),
  );
}

export function listDependencies(
  { dependencies }: PackageFile,
  packageLockFile: PackageLockFile,
  { excludes, folder, glob }: Pick<Options, "excludes" | "glob" | "folder">
): string[] {
  if (!dependencies) return [];
  return Array.from(new Set(Object.keys(dependencies)
    .flatMap(resolver(packageLockFile, Array.prototype.flatMap))
    .filter(excludes)))
    .map(name => path.join(folder, name, glob(name)))
    .concat(folder)
}

export { PackageFile, PackageLockFile };
