import gulp from 'gulp';

async function spawn(command, args = [], options) {
  const { spawn } = await import('node:child_process');
  const child = spawn(command, args.filter(e => e === 0 || e), options);
  if (child.stdout) child.stdout.pipe(process.stdout);
  if (child.stderr) child.stderr.pipe(process.stderr);
  return child;
}

const sources = {
  typescript: 'src/**/*.{j,t}s{,x}',
};
const sourcemaps = true;

function tsc() {
  const options = ['--pretty', sourcemaps ? '--sourceMap' : undefined];
  return spawn('tsc', options);
}
export { tsc as 'transpile:tsc' };

async function tslint() {
  const { default : tslint } = await import('gulp-tslint');
  return gulp.src(sources.typescript)
    .pipe(tslint())
    .pipe(tslint.report());
}
export { tslint as 'lint:tslint' };

function mocha() {
  const options = process.env.CI
    ? ['-R', 'xunit', '-O', 'output=./reports/mocha/test-result.xml']
    : ['-c'];
  return spawn('mocha', options);
}
export { mocha as 'test:mocha' };

export const transpile = gulp.parallel(tsc);
export const lint = gulp.parallel(tslint);
export const build = gulp.parallel(transpile);
export default build;
export const test = gulp.parallel(mocha);
