export const B = { or: "#F97316", orL: "#FB923C", orD: "#EA580C", bl: "#1E293B", blD: "#0F172A", blL: "#334155", w: "#FFF", g: "#94A3B8", gL: "#E2E8F0", gD: "#64748B", bg: "#0B1120", card: "#131C31", ok: "#22C55E", warn: "#EAB308" };

export const card = (extra = {}) => ({ background: B.card, borderRadius: 16, border: `1px solid ${B.blL}`, overflow: "hidden", marginBottom: 20, ...extra });
