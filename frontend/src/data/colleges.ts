export const PARTNER_COLLEGES = [
  'PCTE Group of Institutes (Ludhiana)',
  'GNDEC Engineering College',
  'Thapar Institute (TIET)',
  'Punjab Agricultural University (PAU)',
  'Chitkara University',
  'Christian Medical College (CMC)',
] as const;

export type PartnerCollege = (typeof PARTNER_COLLEGES)[number];

export function normalizeCollegeName(name?: string | null): string {
  if (!name) return '';
  const trimmed = name.trim();
  const direct = PARTNER_COLLEGES.find((c) => c.toLowerCase() === trimmed.toLowerCase());
  if (direct) return direct;
  if (/pcte/i.test(trimmed)) return 'PCTE Group of Institutes (Ludhiana)';
  if (/gndec|guru nanak/i.test(trimmed)) return 'GNDEC Engineering College';
  if (/thapar|tiet/i.test(trimmed)) return 'Thapar Institute (TIET)';
  if (/pau|punjab agricultural/i.test(trimmed)) return 'Punjab Agricultural University (PAU)';
  if (/chitkara/i.test(trimmed)) return 'Chitkara University';
  if (/cmc|christian medical/i.test(trimmed)) return 'Christian Medical College (CMC)';
  return '';
}
