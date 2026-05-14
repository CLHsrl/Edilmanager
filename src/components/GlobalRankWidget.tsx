'use client';

import { Trophy, Star, TrendingUp, ShieldCheck } from 'lucide-react';

interface Props {
  user: {
    name: string | null;
    totalXp: number;
    rank: string;
  }
}

export default function GlobalRankWidget({ user }: Props) {
  const safeUser = user || { name: 'Guest', totalXp: 0, rank: 'NOVIZIO' };
  
  const ranks = [
    { title: "GARZONE DI CANTIERE", minXp: 0, maxXp: 1000, color: "from-orange-400 to-orange-600", bonus: "0%" },
    { title: "MURATORE ESPERTO", minXp: 1000, maxXp: 5000, color: "from-amber-500 to-amber-700", bonus: "1%" },
    { title: "CAPOCANTIERE D'ELITE", minXp: 5000, maxXp: 10000, color: "from-yellow-400 to-yellow-600", bonus: "3%" },
    { title: "ARCHISTAR DEL CANTIERE", minXp: 10000, maxXp: 1000000, color: "from-yellow-300 via-amber-400 to-yellow-600", bonus: "5%" },
  ];

  const currentRankIndex = ranks.findIndex((r, i) => {
    const next = ranks[i+1];
    return safeUser.totalXp >= r.minXp && (!next || safeUser.totalXp < next.minXp);
  });

  const currentRank = ranks[currentRankIndex] || ranks[0];
  const nextRank = ranks[currentRankIndex + 1];
  
  const progress = nextRank 
    ? ((safeUser.totalXp - currentRank.minXp) / (nextRank.minXp - currentRank.minXp)) * 100
    : 100;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 relative overflow-hidden group transition-all hover:shadow-2xl">
      {/* Decorative background glow based on rank color */}
      <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${currentRank.color} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform`}></div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl bg-gradient-to-br ${currentRank.color} text-white shadow-lg`}>
            <Trophy size={20} className={safeUser.totalXp >= 10000 ? "animate-bounce" : ""} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Rank</p>
            <h3 className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{currentRank.title}</h3>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bonus</p>
          <span className="text-lg font-black text-green-600">+{currentRank.bonus}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-tighter">
          <span className="text-gray-400">Progresso Livello</span>
          <span className="text-blue-600">{safeUser.totalXp} / {nextRank ? nextRank.minXp : 'MAX'} XP</span>
        </div>
        <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-50">
          <div 
            className={`h-full bg-gradient-to-r ${currentRank.color} rounded-full transition-all duration-1000 ease-out`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
          <Star size={12} className="text-blue-600 fill-blue-600" />
          <p className="text-[9px] font-bold text-blue-700 uppercase tracking-wider">Top Seller</p>
        </div>
        {nextRank && (
          <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase italic">
            <TrendingUp size={12} /> Prossimo: {nextRank.title}
          </div>
        )}
      </div>
    </div>
  );
}
