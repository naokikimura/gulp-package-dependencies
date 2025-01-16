import { expect } from 'chai';
import resolver, { PackageLockFile } from '../src/resolver.js';

describe('resolver', () => {
  it('it should return dependency list if package-lock version is 1', () => {
    const lockfile1: PackageLockFile = {
      name: 'test',
      version: '0.0.1',
      lockfileVersion: 1,
      dependencies: {
        bar: {
          version: '0.0.1',
          resolved: 'http://example.com/bar.tgz',
          integrity: 'sha1-123',
          requires: {
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
          requires: {
            bar: '^0.0.0',
            baz: '^0.0.1',
          },
        },
      }
    };
    const resolve = resolver(lockfile1);
    const dependencies = resolve('foo');
    expect(dependencies).to.deep.equal(['foo', 'bar', 'baz']);
  });

  it('it should return dependency list if package-lock version is 3', () => {
    const lockfile1: PackageLockFile = {
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
      }
    };
    const resolve = resolver(lockfile1);
    const dependencies = resolve('foo');
    expect(dependencies).to.deep.equal(['foo', 'bar', 'baz']);
  });
});
