import gulp from 'gulp';
import fs, { PathOrFileDescriptor } from 'node:fs';
import path from 'path';
import util from 'util';
import resolver, { Package, PackageLock } from './resolver';

const debug = util.debuglog('gulp-dependencies');

interface Options {
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
  const packageFile: Package = JSON.parse(fs.readFileSync(opts.package, { encoding: 'utf8' }));
  const packageLockFile: PackageLock = JSON.parse(fs.readFileSync(opts.packageLock, { encoding: 'utf8' }));

  const packages = 'dependencies' in packageLockFile ? packageLockFile.dependencies : packageLockFile.packages;
  return gulp.src(
    Array.prototype.flatMap.call<string[], any[], string[]>(
      Object.keys(packageFile.dependencies),
      resolver(packages, Array.prototype.flatMap),
    )
      .filter(opts.excludes)
      .map(name => path.join(opts.folder, name, opts.glob(name)))
      .concat(opts.folder),
    Object.assign({ base: opts.folder }, opts.options),
  );
}
