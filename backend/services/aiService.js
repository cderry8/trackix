function summarizeByCategory(transactions) {
  const map = {};
  for (const t of transactions) {
    if (t.type !== 'expense') continue;
    map[t.category] = (map[t.category] || 0) + t.amount;
  }
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}

export function buildInsights({ transactions, budgets, goals, currency }) {
  const expenses = transactions.filter((t) => t.type === 'expense');
  const income = transactions.filter((t) => t.type === 'income');
  const totalExp = expenses.reduce((s, t) => s + t.amount, 0);
  const totalInc = income.reduce((s, t) => s + t.amount, 0);
  const savingsRate = totalInc > 0 ? ((totalInc - totalExp) / totalInc) * 100 : 0;

  const insights = [];
  const warnings = [];
  const recommendations = [];

  const top = summarizeByCategory(transactions);
  if (top[0]) {
    insights.push(`Largest spend category: ${top[0][0]} (${top[0][1].toFixed(2)} ${currency}).`);
  }

  if (savingsRate >= 20) {
    insights.push('You are maintaining a healthy savings buffer.');
  } else if (savingsRate > 0) {
    recommendations.push('Try increasing savings to at least 20% of income for stronger resilience.');
  } else if (totalInc > 0) {
    warnings.push('Expenses exceeded income in the analyzed window.');
    recommendations.push('Review discretionary categories and set stricter budgets.');
  }

  const now = new Date();
  const unusual = expenses.filter((t) => t.amount > (totalExp / Math.max(expenses.length, 1)) * 3);
  if (unusual.length) {
    warnings.push(`${unusual.length} transaction(s) are unusually large vs your average spend.`);
  }

  for (const b of budgets || []) {
    const spent = expenses
      .filter((t) => t.category === b.category && sameMonth(t.date, b.month))
      .reduce((s, t) => s + t.amount, 0);
    if (spent > b.limit) {
      warnings.push(`Budget exceeded for ${b.category}: spent ${spent.toFixed(2)} vs limit ${b.limit.toFixed(2)} ${currency}.`);
    } else if (spent > b.limit * 0.85) {
      recommendations.push(`Category "${b.category}" is at ${((spent / b.limit) * 100).toFixed(0)}% of budget.`);
    }
  }

  for (const g of goals || []) {
    const left = g.targetAmount - g.currentAmount;
    if (left > 0) {
      recommendations.push(
        `Goal "${g.title}": add ~${(left / 3).toFixed(2)} ${currency}/month for 3 months to close the gap.`
      );
    }
  }

  if (!insights.length) insights.push('Add more transactions to unlock deeper pattern analysis.');
  if (!recommendations.length) recommendations.push('Automate a recurring transfer to your primary savings goal.');

  const weeklySummary = `Period summary (${currency}): income ${totalInc.toFixed(2)}, expenses ${totalExp.toFixed(2)}, savings rate ${savingsRate.toFixed(1)}%.`;

  return { insights, warnings, recommendations, weeklySummary };
}

export function computeHealthScore({ transactions }) {
  const expenses = transactions.filter((t) => t.type === 'expense');
  const income = transactions.filter((t) => t.type === 'income');
  const totalExp = expenses.reduce((s, t) => s + t.amount, 0);
  const totalInc = income.reduce((s, t) => s + t.amount, 0);
  let score = 55;
  if (totalInc > 0) {
    const rate = (totalInc - totalExp) / totalInc;
    score += Math.min(35, Math.max(-25, rate * 80));
  }
  const volatility =
    expenses.length > 2
      ? Math.min(
          15,
          Math.sqrt(
            expenses.reduce((s, t) => {
              const avg = totalExp / expenses.length;
              return s + (t.amount - avg) ** 2;
            }, 0) / expenses.length
          ) / (totalExp / expenses.length || 1)
        )
      : 0;
  score -= volatility * 5;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function sameMonth(a, b) {
  const d1 = new Date(a);
  const d2 = new Date(b);
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
}
