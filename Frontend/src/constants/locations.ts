/**
 * Location hierarchy for reports: Kigali Province, 3 districts, 3 sectors (Umurenge), 3 cells (Akagali).
 * Used for dropdowns in the report form.
 */

export const PROVINCE = 'Kigali';

export const DISTRICTS = ['Gasabo', 'Kicukiro', 'Nyarugenge'] as const;
export type DistrictKey = (typeof DISTRICTS)[number];

/** Sector (Umurenge) per district */
export const SECTOR_BY_DISTRICT: Record<DistrictKey, string> = {
  Gasabo: 'Remera',
  Kicukiro: 'Nyarugunga',
  Nyarugenge: 'Nyamirambo',
};

/** Cell (Akagali) per district (one cell per sector in this setup) */
export const CELL_BY_DISTRICT: Record<DistrictKey, string> = {
  Gasabo: 'Nyarutarama',
  Kicukiro: 'Rwimbogo',
  Nyarugenge: 'Rugarama',
};

export function getSectorForDistrict(district: string): string {
  return SECTOR_BY_DISTRICT[district as DistrictKey] ?? '';
}

export function getCellForDistrict(district: string): string {
  return CELL_BY_DISTRICT[district as DistrictKey] ?? '';
}
