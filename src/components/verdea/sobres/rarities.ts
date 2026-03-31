export interface Rarity {
  name: string;
  chance: number;
  label: string;
  color: string;
  glowHsl: string;
  textColor: string;
  tier: number;
  rewards: string[];
}

export const rarities: Rarity[] = [
  { name: "Silvestre", chance: 45, label: "45 %", color: "bg-[#f0f9f4]", glowHsl: "140,25%,65%", textColor: "text-[#1a3a2a]", tier: 0, rewards: ["Puntos extra", "Multiplicador ×2", "Descuento 5%"] },
  { name: "Brote", chance: 30, label: "30 %", color: "bg-[#ecfdf5]", glowHsl: "147,40%,50%", textColor: "text-[#064e3b]", tier: 1, rewards: ["Maceta gratis", "Envío bonificado", "Planta sorpresa"] },
  { name: "Polen", chance: 15, label: "15 %", color: "bg-[#fff1f2]", glowHsl: "340,45%,65%", textColor: "text-[#4c0519]", tier: 2, rewards: ["Planta premium", "Descuento 25%", "Taller online"] },
  { name: "Raíz", chance: 8, label: "8 %", color: "bg-[#fffbeb]", glowHsl: "43,55%,55%", textColor: "text-[#451a03]", tier: 3, rewards: ["Crédito en tienda", "Alocasia Rara", "Box Verdie"] },
  { name: "Exótica", chance: 2, label: "2 %", color: "bg-[#f5f3ff]", glowHsl: "270,45%,70%", textColor: "text-[#2e1065]", tier: 4, rewards: ["Planta importada", "Membresía Flor"] },
  { name: "Primordial", chance: 0.5, label: "0.5 %", color: "bg-[#fff9eb]", glowHsl: "43,65%,60%", textColor: "text-[#451a03]", tier: 5, rewards: ["Edición Limitada", "Membresía Árbol"] },
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
