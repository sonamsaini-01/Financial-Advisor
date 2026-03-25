import { useUserData } from "@/context/UserDataContext";
import { Navigate } from "react-router-dom";
import { calculateHealthScore, generateInsights } from "@/lib/financial-calculations";
import HealthScoreRing from "@/components/dashboard/HealthScoreRing";
import CategoryBreakdown from "@/components/dashboard/CategoryBreakdown";
import InsightsSection from "@/components/dashboard/InsightsSection";
import SmartAlerts from "@/components/dashboard/SmartAlerts";
import AchievementSection from "@/components/dashboard/AchievementSection";
import FinancialReport from "@/components/dashboard/FinancialReport";
import VoiceGuide from "@/components/VoiceGuide";
import BottomNav from "@/components/layout/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Wallet, Lightbulb, FileDown } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const DAILY_TIPS = [
  "The 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings.",
  "An emergency fund should ideally cover 3–6 months of your basic expenses.",
  "Invest early! Compounding interest is most powerful when given time to grow.",
  "Track every expense for 30 days. You'll be surprised where the small leaks are.",
  "Before buying something non-essential, wait 48 hours to see if you still want it.",
  "Automate your savings. If you don't see the money, you won't spend it.",
];

export default function Dashboard() {
  const { userData, isOnboarded } = useUserData();
  const dailyTip = DAILY_TIPS[new Date().getDate() % DAILY_TIPS.length];

  const handleDownloadPdf = () => {
    const reportElement = document.getElementById("financial-report");
    if (!reportElement) return;

    // Temporarily make it visible for capture
    reportElement.style.display = "block";

    html2canvas(reportElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;
      const width = pdfWidth;
      const height = width / ratio;

      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save("Financial-Health-Report.pdf");

      // Hide it again
      reportElement.style.display = "none";
    });
  };

  if (!isOnboarded || !userData) return <Navigate to="/" replace />;

  const { total, breakdown } = calculateHealthScore(userData);
  const insights = generateInsights(userData, breakdown);
  const surplus = userData.monthlyIncome - userData.monthlyExpenses;
  const netWorth = userData.currentSavings + userData.investments;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header with gradient accent */}
      <div className="relative bg-card px-4 pt-6 pb-5 border-b border-border/40 overflow-hidden print:hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back 👋</p>
            <h1 className="text-xl font-bold tracking-tight">Your Money Health</h1>
          </div>
          <button 
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>DOWNLOAD PDF</span>
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6 max-w-lg mx-auto print:hidden">
        {/* Score Ring */}
        <Card className="shadow-lg border-border/40">
          <CardContent className="pt-6 pb-5 flex flex-col items-center relative">
            <HealthScoreRing score={total} />
            <p className="text-sm text-muted-foreground mt-3 font-medium">Money Health Score</p>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-3.5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">Monthly Surplus</p>
              </div>
              <p className={`text-lg font-bold tabular-nums ${surplus >= 0 ? "text-primary" : "text-destructive"}`}>
                ₹{surplus.toLocaleString("en-IN")}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {userData.monthlyIncome > 0 ? `${Math.round((surplus / userData.monthlyIncome) * 100)}% of income` : ""}
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-3.5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Wallet className="w-3.5 h-3.5 text-accent" />
                </div>
                <p className="text-xs text-muted-foreground">Net Worth</p>
              </div>
              <p className="text-lg font-bold tabular-nums">
                ₹{netWorth.toLocaleString("en-IN")}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Savings + Investments
              </p>
            </CardContent>
          </Card>
        </div>

        <SmartAlerts data={userData} breakdown={breakdown} />
        
        {/* Achievements / Milestones */}
        <AchievementSection data={userData} breakdown={breakdown} totalScore={total} />

        {/* Daily Tip with Voice-Ready Context */}
        <Card className="bg-primary/5 border-primary/20 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Lightbulb className="w-12 h-12 text-primary rotate-12" />
          </div>
          <CardContent className="p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <Lightbulb className="w-4 h-4 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider">Daily Financial Wisdom</p>
              <p className="text-sm text-foreground leading-relaxed font-medium">{dailyTip}</p>
            </div>
          </CardContent>
        </Card>

        <CategoryBreakdown breakdown={breakdown} />
        <InsightsSection insights={insights} />
      </div>

      <FinancialReport data={userData} />

      <VoiceGuide context={`Here's your daily financial wisdom: ${dailyTip}. ${insights[0]?.title || ""}`} />
      <BottomNav />
    </div>
  );
}
