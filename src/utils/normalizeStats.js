import { STATUS_OPTIONS } from "./constants";

export function normalizeStats(raw) {
  const map = Object.fromEntries(
    raw.map(s => [s._id, s.count])
  );

  return STATUS_OPTIONS.map(status => ({
    status,
    count: map[status] || 0,
  }));
}
export const STATUS_OPTIONS = [
  "NEW",
  "REVIEWING",
  "SHORTLISTED",
  "REJECTED",
  "HIRED",
];
