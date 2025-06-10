export const parseHeadcount = (value: string): number => {
  if (!value) return 0;

  const trimmed = value.trim().toUpperCase().replace("+", "");

  const match = trimmed.match(/^([\d.]+)([KM]?)$/);
  if (!match) return 0;

  const num = parseFloat(match[1]);
  const suffix = match[2];

  if (suffix === "K") return num * 1000;
  if (suffix === "M") return num * 1000000;

  return num;
};
