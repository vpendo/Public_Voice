/**
 * Cell-level report categories and dynamic problem types.
 * Must match backend: schemas/report.py ALLOWED_CATEGORIES, ALLOWED_PROBLEM_TYPES.
 */

export const REPORT_CATEGORIES = [
  'service_delivery',
  'land_property',
  'infrastructure_utilities',
  'social_community',
  'administrative',
  'other',
] as const;

export type ReportCategoryKey = (typeof REPORT_CATEGORIES)[number];

/** Problem types per category (dynamic dropdown) */
export const PROBLEM_TYPES_BY_CATEGORY: Record<ReportCategoryKey, readonly string[]> = {
  service_delivery: [
    'delay_assistance',
    'no_response',
    'service_not_delivered',
    'other',
  ],
  land_property: [
    'boundary_conflict',
    'ownership_dispute',
    'inheritance',
    'registration_issue',
  ],
  infrastructure_utilities: [
    'water_shortage',
    'road_damage',
    'drainage',
    'electricity',
    'waste_management',
  ],
  social_community: [
    'gbv',
    'family_conflict',
    'child_protection',
    'community_dispute',
  ],
  administrative: [
    'not_followed_up',
    'poor_communication',
    'delayed_decision',
    'misconduct',
  ],
  other: [], // User types their own in category_other
} as const;

export const URGENCY_LEVELS = ['low', 'medium', 'high', 'emergency'] as const;
export type UrgencyKey = (typeof URGENCY_LEVELS)[number];

export const RESPONSIBLE_INSTITUTIONS = [
  'cell_office',
  'sector_office',
  'district_authority',
  'social_affairs_officer',
  'land_bureau',
  'other',
] as const;

export function isReportCategory(value: string): value is ReportCategoryKey {
  return (REPORT_CATEGORIES as readonly string[]).includes(value);
}

export function getProblemTypesForCategory(category: ReportCategoryKey | ''): readonly string[] {
  if (!category || !isReportCategory(category)) return [];
  return PROBLEM_TYPES_BY_CATEGORY[category];
}
