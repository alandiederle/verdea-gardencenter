/* ─── 6-tier rarity system: Sobres de Crecimiento ─── */

export interface Rarity {
  name: string;
  chance: number;
  label: string;
  color: string;        // bg class
  glowHsl: string;      // raw HSL for glow effects
  textColor: string;    // text class
  tier: number;
  rewards: string[];
}

export const rarities: Rarity[] = [
  {
    name: "Silvestre",
    chance: 45,
    label: "45 %",
    color: "bg-[hsl(140,22%,90%)]",
    glowHsl: "140,25%,65%",
    textColor: "text-[hsl(150,30%,22%)]",
    tier: 0,
    rewards: ["Puntos extra", "Multiplicador temporal ×2", "Descuento 5 %", "Acceso anticipado"],
  },
  {
    name: "Brote",
    chance: 30,
    label: "30 %",
    color: "bg-[hsl(147,35%,85%)]",
    glowHsl: "147,40%,50%",
    textColor: "text-[hsl(147,42%,18%)]",
    tier: 1,
    rewards: ["Maceta gratis", "Envío bonificado", "Planta sorpresa pequeña", "Tickets extra"],
  },
  {
    name: "Polen",
    chance: 15,
    label: "15 %",
    color: "bg-[hsl(340,32%,90%)]",
    glowHsl: "340,45%,65%",
    textColor: "text-[hsl(340,38%,28%)]",
    tier: 2,
    rewards: ["Planta premium", "Descuento 25 %", "Taller online", "Consulta con experto"],
  },
  {
    name: "Raíz",
    chance: 8,
    label: "8 %",
    color: "bg-[hsl(43,40%,88%)]",
    glowHsl: "43,55%,55%",
    textColor: "text-[hsl(43,45%,20%)]",
    tier: 3,
    rewards: ["Crédito en tienda", "Planta colección Araceae", "Box sorpresa Verdie"],
  },
  {
    name: "Exótica",
    chance: 2,
    label: "2 %",
    color: "bg-[hsl(270,30%,92%)]",
    glowHsl: "270,45%,70%",
    textColor: "text-[hsl(270,35%,25%)]",
    tier: 4,
    rewards: ["Planta importada exclusiva", "Crédito alto", "Membresía Flor (1 mes)"],
  },
  {
    name: "Primordial",
    chance: 0.5,
    label: "0.5 %",
    color: "bg-[hsl(43,50%,92%)]",
    glowHsl: "43,65%,60%",
    textColor: "text-[hsl(43,50%,18%)]",
    tier: 5,
    rewards: ["Planta edición limitada", "Membresía Árbol (1 mes)", "Crédito máximo"],
  },
];

export function rollRarity(): number {
  const rand = Math.random() * 100;
  if (rand < 0.5) return 5;
  if (rand < 2.5) return 4;
  if (rand < 10.5) return 3;
  if (rand < 25.5) return 2;
  if (rand < 55.5) return 1;
  return 0;
}

export function pickReward(rarity: Rarity): string {
  return rarity.rewards[Math.floor(Math.random() * rarity.rewards.length)];
}
