export type GeographicOption = {
  label: string;
  key: string;
};

/**
 * Small, hand-maintained stub of Chinese administrative regions.
 *
 * The original implementation sourced live province/city/district data from
 * the `china-division` npm package, but that package's names are only
 * available in Chinese (Simplified). Since this project is English-only,
 * building a full translation table for the entire dataset (dozens of
 * provinces, hundreds of cities) would be far more invasive than this
 * feature warrants. Instead, this file provides a compact set of
 * pinyin/English-named regions covering the same shape of data (top-level
 * provinces/regions plus a couple of cities or districts each) so the
 * address form still functions end-to-end.
 */
export const provinceOptions: GeographicOption[] = [
  { label: 'Beijing', key: '110000' },
  { label: 'Hebei', key: '130000' },
  { label: 'Jiangsu', key: '320000' },
  { label: 'Zhejiang', key: '330000' },
  { label: 'Guangdong', key: '440000' },
  { label: 'Taiwan', key: '710000' },
  { label: 'Hong Kong', key: '810000' },
  { label: 'Macao', key: '820000' },
];

const cityOptionsByProvince: Record<string, GeographicOption[]> = {
  '110000': [
    { label: 'Dongcheng District', key: '110101' },
    { label: 'Xicheng District', key: '110102' },
  ],
  '130000': [
    { label: 'Shijiazhuang', key: '130100' },
    { label: 'Tangshan', key: '130200' },
  ],
  '320000': [
    { label: 'Nanjing', key: '320100' },
    { label: 'Suzhou', key: '320500' },
  ],
  '330000': [
    { label: 'Hangzhou', key: '330100' },
    { label: 'Ningbo', key: '330200' },
  ],
  '440000': [
    { label: 'Guangzhou', key: '440100' },
    { label: 'Shenzhen', key: '440300' },
  ],
  '710000': [{ label: 'Taipei', key: '710100' }],
  '810000': [{ label: 'Hong Kong Island', key: '810100' }],
  '820000': [{ label: 'Macao Peninsula', key: '820100' }],
};

const resolveProvinceKey = (provinceKey: string): string | undefined => {
  if (provinceKey.length >= 6) {
    return cityOptionsByProvince[provinceKey] ? provinceKey : undefined;
  }
  // Support short (e.g. 2-digit) province codes by matching the prefix.
  return provinceOptions.find((item) => item.key.startsWith(provinceKey))
    ?.key;
};

export const getCityOptions = (provinceKey: string): GeographicOption[] => {
  const resolvedKey = resolveProvinceKey(provinceKey);
  if (!resolvedKey) {
    return [];
  }
  return cityOptionsByProvince[resolvedKey] ?? [];
};
