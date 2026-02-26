/**
 * Report category keys. Must match backend ALLOWED_CATEGORIES in:
 * - Backend/schemas/report.py
 * - Backend/models/report.py (check_category_valid)
 * - Backend/services/ai_processor.py
 */
export const REPORT_CATEGORIES = [
  'roads',
  'water',
  'security',
  'sanitation',
  'electricity',
  'health',
  'education',
  'Land',
  'other',
] as const;

export type ReportCategoryKey = (typeof REPORT_CATEGORIES)[number];

export function isReportCategory(value: string): value is ReportCategoryKey {
  return (REPORT_CATEGORIES as readonly string[]).includes(value);
}
