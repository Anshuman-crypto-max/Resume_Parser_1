export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function normalizeSkill(skill: string) {
  return skill.trim().replace(/\s+/g, " ");
}
