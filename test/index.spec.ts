import { expect } from 'chai';
import { Stream } from 'node:stream';
import dependencies from '../src/index';

describe('Plugin', () => {
  it.skip('it should return Stream instance', () => {
    expect(dependencies()).to.be.an.instanceof(Stream);
  });
});
