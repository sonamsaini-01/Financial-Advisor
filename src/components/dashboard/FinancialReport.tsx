import React from "react";
import { UserFinancialData, HealthScoreBreakdown } from "@/types/finance";
import { calculateHealthScore, getScoreLabel } from "@/lib/financial-calculations";
import { format } from "date-fns";

export default function FinancialReport({ data }: { data: UserFinancialData }) {
  const { total, breakdown } = calculateHealthScore(data);
  const surplus = data.monthlyIncome - data.monthlyExpenses;
  const netWorth = data.currentSavings + data.investments;

  return (
    <div id="financial-report" className="hidden p-8 bg-white text-black font-sans min-h-screen">
      <div className="flex justify-between items-start border-b-2 border-primary pb-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Financial Health Report</h1>
          <p className="text-sm text-gray-500">Generated on {format(new Date(), "PPP")}</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-black text-primary">{total}</div>
          <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Health Score</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-12">
        <div className="space-y-4">
          <h2 className="text-xl font-bold border-l-4 border-primary pl-3 mb-4 text-gray-800 uppercase tracking-tight">Summary</h2>
          <div className="flex justify-between border-b border-gray-100 py-2">
            <span className="text-gray-500">Monthly Income</span>
            <span className="font-bold">₹{data.monthlyIncome.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 py-2">
            <span className="text-gray-500">Monthly Expenses</span>
            <span className="font-bold text-destructive">₹{data.monthlyExpenses.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 py-2">
            <span className="text-gray-500">Monthly Surplus</span>
            <span className={`font-bold ${surplus >= 0 ? "text-primary" : "text-destructive"}`}>₹{surplus.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 py-2">
            <span className="text-gray-500">Net Worth</span>
            <span className="font-bold">₹{netWorth.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold border-l-4 border-accent pl-3 mb-4 text-gray-800 uppercase tracking-tight">Score Breakdown</h2>
          {Object.entries(breakdown).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-xs font-bold uppercase text-gray-400">
                <span>{key}</span>
                <span>{value}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500" 
                  style={{ width: `${value}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
        <h2 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
          Expert Recommendation
        </h2>
        <p className="text-gray-600 leading-relaxed italic">
          Based on your current data, your overall financial health is <span className="font-bold text-primary">{getScoreLabel(total)}</span>. 
          {total < 80 ? " There is room for optimization in your savings and investment strategies." : " You are doing an exceptional job of managing your finances."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-auto pt-12 text-[10px] text-gray-400">
        <p>© 2026 Financial Advisor AI. All rights reserved.</p>
        <p className="text-right italic">"The best time to start was yesterday, the second best time is now."</p>
      </div>
    </div>
  );
}
