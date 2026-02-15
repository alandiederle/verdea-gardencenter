import { motion } from "framer-motion";
import { rarities, type Rarity } from "./rarities";

export interface Discovery {
  rarity: Rarity;
  reward: string;
  timestamp: number;
}

interface Props {
  discoveries: Discovery[];
}

export default function DiscoveryGallery({ discoveries }: Props) {
  if (discoveries.length === 0) return null;

  return (
    <div className="mt-24 max-w-3xl mx-auto">
      <h3 className="font-serif text-2xl font-bold text-foreground text-center mb-2">
        Esto fue lo que descubriste
      </h3>
      <p className="text-sm text-muted-foreground text-center font-sans mb-8">
        Tu colección crece con cada sobre que abrís.
      </p>

      {/* Rarity summary chips */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {rarities.map((r) => {
          const count = discoveries.filter((d) => d.rarity.tier === r.tier).length;
          return (
            <span
              key={r.name}
              className={`px-3 py-1 rounded-full text-xs font-sans font-medium ${r.color} ${r.textColor} ${
                count === 0 ? "opacity-40" : ""
              }`}
            >
              {r.name} × {count}
            </span>
          );
        })}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {discoveries
          .slice()
          .reverse()
          .map((d, i) => (
            <motion.div
              key={d.timestamp + i}
              className={`rounded-2xl border border-border/50 ${d.rarity.color} p-5 flex flex-col gap-2`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -3, boxShadow: `0 8px 24px hsl(${d.rarity.glowHsl} / 0.15)` }}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-sans font-semibold uppercase tracking-wider ${d.rarity.textColor} opacity-70`}>
                  {d.rarity.name}
                </span>
                <span className={`text-[10px] font-sans ${d.rarity.textColor} opacity-50`}>
                  {d.rarity.label}
                </span>
              </div>
              <span className={`font-serif text-sm font-semibold ${d.rarity.textColor} leading-snug`}>
                {d.reward}
              </span>
            </motion.div>
          ))}
      </div>
    </div>
  );
}
