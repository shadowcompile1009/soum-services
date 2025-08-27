export enum Cities {
  RIYADH = 'Riyadh',
  RIYADH_AR = 'الرياض',
  JEDDAH = 'Jeddah',
  JEDDAH_AR = 'جدة',
  JEDDAH2 = 'Jiddah',
  JEDDAH2_AR = 'جده',
}

export enum CitiesNames {
  RIYADH = 'RIYADH',
  JEDDAH = 'JEDDAH',
  DAMMAM = 'DAMMAM',
}

const CityVariants: Record<CitiesNames, string[]> = {
  [CitiesNames.RIYADH]: ['Riyadh', 'الرياض', 'Riyad', 'riyadh'],
  [CitiesNames.JEDDAH]: ['Jeddah', 'جدة', 'Jedda', 'jeddah', 'jiddah', 'جدة'],
  [CitiesNames.DAMMAM]: ['Dammam', 'dammam', 'addammam', 'الدمام'],
};

export function isCityMatch(input: string, city: CitiesNames): boolean {
  const variants = CityVariants[city];
  return variants
    ? variants.some(variant => variant.toLowerCase() === input.toLowerCase())
    : false;
}
