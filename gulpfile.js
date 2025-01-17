import gulp from 'gulp';

async function spawn(command, args = [], options) {
  const { spawn } = await import('node:child_process');
  const child = spawn(command, args.filter(e => e === 0 || e), options);
  if (child.stdout) child.stdout.pipe(process.stdout);
  if (child.stderr) child.stderr.pipe(process.stderr);
  return child;
}

const sourcemaps = true;

function tsc() {
  const options = ['--pretty', sourcemaps ? '--sourceMap' : undefined];
  return spawn('tsc', options);
}
export { tsc as 'transpile:tsc' };

async function tslint() {
  const options = process.env.CI ? ["--no-color"] : ["--color"]
  return spawn('eslint', options.concat(["src", "test"]));
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
export const test = gulp.parallel(mocha);
export const build = gulp.series(gulp.parallel(transpile, lint), test);
export default build;
