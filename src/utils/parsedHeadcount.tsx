export const parseHeadcount = (value: string | number): number => {
  if (!value && value !== 0) return 0;
  
  // If it's already a number, return it
  if (typeof value === 'number') return value;

  const trimmed = value.trim().toUpperCase().replace("+", "");
  const regex = /^([\d.]+)([KM]?)$/;
  const match = regex.exec(trimmed);

  if (!match) return 0;

  const num = parseFloat(match[1]);
  const suffix = match[2];

  if (suffix === "K") return num * 1000;
  if (suffix === "M") return num * 1000000;

  return num;
};

export const formatHeadcount = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};
