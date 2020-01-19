/// <reference types="../src/@types/package-lock-json" />

import { expect } from 'chai';
import { Dependencies } from 'package-lock-json';
import resolver from '../src/resolver';

describe('resolver', () => {
  it('it should return dependency list', () => {
    const dictionary: Dependencies = {
      bar: {
        requires: {
          foo: '^0.0.3',
        },
      },
      baz: {
      },
      foo: {
        requires: {
          bar: '^0.0.0',
          baz: '^0.0.1',
        },
      },
    };
    const resolve = resolver(dictionary);
    const dependencies = resolve('foo');
    expect(dependencies).to.deep.equal(['foo', 'bar', 'baz']);
  });
});
