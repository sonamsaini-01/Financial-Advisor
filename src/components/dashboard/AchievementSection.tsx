import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, CheckCircle2, Circle, Star, Target, ShieldCheck, Zap } from "lucide-react";
import { UserFinancialData, HealthScoreBreakdown } from "@/types/finance";
import { Progress } from "@/components/ui/progress";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  condition: (data: UserFinancialData, breakdown: HealthScoreBreakdown) => boolean;
  progress: (data: UserFinancialData, breakdown: HealthScoreBreakdown) => number;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "emergency-master",
    title: "Emergency Master",
    description: "Built a 6-month safety net",
    icon: ShieldCheck,
    condition: (_, breakdown) => breakdown.emergency >= 90,
    progress: (_, breakdown) => breakdown.emergency,
  },
  {
    id: "super-saver",
    title: "Super Saver",
    description: "Saving >20% of monthly income",
    icon: Zap,
    condition: (_, breakdown) => breakdown.savings >= 80,
    progress: (_, breakdown) => breakdown.savings,
  },
  {
    id: "debt-free",
    title: "Debt Free",
    description: "Keeping expenses well below income",
    icon: CheckCircle2,
    condition: (_, breakdown) => breakdown.debt >= 90,
    progress: (_, breakdown) => breakdown.debt,
  },
  {
    id: "investor",
    title: "Smart Investor",
    description: "Building wealth through assets",
    icon: Target,
    condition: (_, breakdown) => breakdown.investments >= 50,
    progress: (_, breakdown) => Math.min(breakdown.investments * 2, 100),
  },
  {
    id: "financial-guru",
    title: "Financial Guru",
    description: "Overall health score is excellent",
    icon: Star,
    condition: (data, _) => {
      // Need total score here, but we'll approximate or calculate
      return true; // placeholder
    },
    progress: (_, breakdown) => {
        const total = (breakdown.emergency + breakdown.savings + breakdown.debt + breakdown.investments + breakdown.retirement) / 5;
        return total;
    }
  },
];

export default function AchievementSection({ 
  data, 
  breakdown,
  totalScore 
}: { 
  data: UserFinancialData; 
  breakdown: HealthScoreBreakdown;
  totalScore: number;
}) {
  const unlockedCount = ACHIEVEMENTS.filter(a => {
    if (a.id === "financial-guru") return totalScore >= 85;
    return a.condition(data, breakdown);
  }).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-bold flex items-center gap-2">
          <Trophy className="w-4 h-4 text-accent" />
          Financial Milestones
        </h2>
        <span className="text-[10px] font-bold bg-accent/10 text-accent px-2 py-0.5 rounded-full uppercase tracking-wider">
          {unlockedCount} / {ACHIEVEMENTS.length} UNLOCKED
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = achievement.id === "financial-guru" 
            ? totalScore >= 85 
            : achievement.condition(data, breakdown);
          const Icon = achievement.icon;
          const prog = achievement.progress(data, breakdown);

          return (
            <Card key={achievement.id} className={`overflow-hidden transition-all duration-300 ${isUnlocked ? "border-accent/50 bg-accent/5" : "border-border/40 opacity-70 grayscale-[0.5]"}`}>
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isUnlocked ? "bg-accent/20 text-accent shadow-inner" : "bg-muted text-muted-foreground"}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className={`text-sm font-bold truncate ${isUnlocked ? "text-foreground" : "text-muted-foreground"}`}>
                        {achievement.title}
                      </p>
                      {isUnlocked && <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />}
                    </div>
                    <p className="text-[10px] text-muted-foreground mb-2 truncate">
                      {achievement.description}
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[8px] font-bold text-muted-foreground uppercase tracking-tighter">
                        <span>Progress</span>
                        <span>{Math.round(prog)}%</span>
                      </div>
                      <Progress value={prog} className={`h-1 ${isUnlocked ? "bg-accent/20 [&>div]:bg-accent" : "bg-muted"}`} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
