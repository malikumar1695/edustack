
export const ROLES = ["admin", "teacher", "student", "parents"] as const;
export type RoleName = typeof ROLES[number];

export const isRoleName = (v: unknown): v is RoleName =>
    typeof v === "string" && (ROLES as readonly string[]).includes(v);