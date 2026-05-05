export const overdueDays = (eta: string | null): number => {
  if (!eta) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const etaDate = new Date(eta + 'T00:00:00');
  return Math.max(0, Math.floor((today.getTime() - etaDate.getTime()) / 86_400_000));
};

export const fmtDate = (date: string | null, opts?: { short?: boolean }): string => {
  if (!date) return '—';
  const d = new Date(date + 'T00:00:00');
  if (opts?.short) {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
