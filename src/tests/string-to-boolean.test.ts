import {stringToBoolean} from '../string-to-boolean';

describe('stringToBoolean', () => {
  it('returns true when a string with the contents of true is provided', () => {
    expect(stringToBoolean('true')).toBe(true);
  });

  it('returns false when a string with the contents of false is provided', () => {
    expect(stringToBoolean('false')).toBe(false);
  });

  it('returns false when a random string is provided', () => {
    expect(stringToBoolean('asd9128SND83asd')).toBe(false);
  });

  it('returns false when the type is not string', () => {
    expect(stringToBoolean(4)).toBe(false);
  });
});
