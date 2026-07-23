import { describe, expect, it } from 'vitest';
import { getCityOptions, provinceOptions } from './chinaDivision';

describe('chinaDivision geographic options', () => {
  it('keeps province values compatible with existing six-digit province ids', () => {
    expect(provinceOptions).toContainEqual({
      label: 'Zhejiang',
      key: '330000',
    });
    expect(provinceOptions).toContainEqual({
      label: 'Taiwan',
      key: '710000',
    });
  });

  it('returns city options for ordinary provinces', () => {
    expect(getCityOptions('130000')).toContainEqual({
      label: 'Shijiazhuang',
      key: '130100',
    });
    expect(getCityOptions('320000')).toContainEqual({
      label: 'Nanjing',
      key: '320100',
    });
    expect(getCityOptions('32')).toContainEqual({
      label: 'Nanjing',
      key: '320100',
    });
  });

  it('returns district options for municipalities', () => {
    expect(getCityOptions('110000')).toContainEqual({
      label: 'Dongcheng District',
      key: '110101',
    });
  });

  it('returns city options for Hong Kong, Macao and Taiwan', () => {
    expect(getCityOptions('710000')).toContainEqual({
      label: 'Taipei',
      key: '710100',
    });
    expect(getCityOptions('810000')).toContainEqual({
      label: 'Hong Kong Island',
      key: '810100',
    });
    expect(getCityOptions('820000')).toContainEqual({
      label: 'Macao Peninsula',
      key: '820100',
    });
  });
});
