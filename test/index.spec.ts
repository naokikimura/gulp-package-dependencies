import { expect } from 'chai';
import stream from 'stream';
import dependencies from '../src/index';

describe('Plugin', () => {
  it('it should return Stream instance', () => {
    expect(dependencies()).to.be.an.instanceof(stream.Stream);
  });
});
