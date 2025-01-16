import { expect } from 'chai';
import { listDependencies, PackageFile, PackageLockFile } from '../src/index.js';

describe('Plugin', () => {
  it('it should return dependency list if package-lock version is 3', () => {
    const packagefile: PackageFile = {
      dependencies: {
        bar: '^0.0.1',
        baz: '^0.0.2',
        foo: '^0.0.3',
      },
      devDependencies: {
        qux: '^0.0.4',
      }
    };
    const lockfile: PackageLockFile = {
      name: 'test',
      version: '0.0.1',
      lockfileVersion: 3,
      packages: {
        bar: {
          version: '0.0.1',
          resolved: 'http://example.com/bar.tgz',
          integrity: 'sha1-123',
          dependencies: {
            foo: '^0.0.3',
          },
        },
        baz: {
          version: '0.0.2',
          resolved: 'http://example.com/baz.tgz',
          integrity: 'sha1-456',
        },
        foo: {
          version: '0.0.3',
          resolved: 'http://example.com/foo.tgz',
          integrity: 'sha1-789',
          dependencies: {
            bar: '^0.0.0',
            baz: '^0.0.1',
          },
        },
        qux: {
          version: '0.0.4',
          resolved: 'http://example.com/qux.tgz',
          integrity: 'sha1-abc',
          dev: true,
        }
      }
    };
    const dependencies = listDependencies(packagefile, lockfile, { excludes: () => true, folder: 'node_modules', glob: name => '**/*' });
    expect(dependencies).to.have.members([
      'node_modules/bar/**/*',
      'node_modules/baz/**/*',
      'node_modules/foo/**/*',
      'node_modules',
    ]);
  });
});
