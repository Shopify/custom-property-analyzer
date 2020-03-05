import glob from 'glob';

import {analyzeCustomProperties} from '../analyze-custom-properties';

jest.mock('glob', () => ({
  __esModule: true,
  default: jest.fn((_a, _b, cb) => cb(false, ['src/tests/fixtures.scss'])),
}));

const globSpy = (glob as unknown) as jest.Mock;

describe('analyzeCustomProperties', () => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log');
    consoleLogSpy.mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    globSpy.mockReset();
  });

  it('sets logLevel to verbose', async () => {
    await analyzeCustomProperties({});
    expect(consoleLogSpy).toHaveBeenCalledTimes(3);
  });

  it(`catches errors rather than throwing`, async () => {
    globSpy.mockImplementationOnce((_a, _b, cb) => cb(true, []));
    let error = false;
    await analyzeCustomProperties({}).catch((err) => {
      error = err;
    });
    expect(error).toBe(true);
  });
});
