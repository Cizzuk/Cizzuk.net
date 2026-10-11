import { DateTime } from "luxon";

export const toDT = (value, tz) => {
  if (!value) return DateTime.now().setZone(tz);
  if (value instanceof Date) return DateTime.fromJSDate(value, { zone: tz });
  return DateTime.fromISO(String(value), { zone: tz });
};

export const getCurrentYear = (tz) => DateTime.now().setZone(tz).toFormat("yyyy");

export const ensureDateFromFilename = (item) => {
  if (!item?.data?.date) {
    const match = item?.inputPath?.match(/(\d{4}-\d{2}-\d{2})-/);
    if (match) item.data.date = match[1];
  }
};

export const sortByDateAndFilenameDesc = (a, b) => {
  const dateComparison = new Date(b.data?.date || b.date) - new Date(a.data?.date || a.date);
  if (dateComparison) return dateComparison;
  return (b.inputPath || b.file).localeCompare(a.inputPath || a.file);
};

export const firstItems = (items, n) => {
  if (!Array.isArray(items)) return items;
  const count = Number(n);
  if (Number.isNaN(count)) return items;
  return count < 0 ? items.slice(count) : items.slice(0, count);
};
