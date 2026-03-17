import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, BarChart3, Landmark, Receipt, Target, FileText } from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import {
  getClientById,
  formatCurrency,
  getTotalAssets,
  getTotalLiabilities,
  getNetWorth,
  getTotalMonthlyIncome,
  getTotalMonthlyExpense,
} from '../data/mockData';

const tabs = [
  { key: 'info', label: '基本資料', icon: User },
  { key: 'overview', label: '財務總覽', icon: BarChart3 },
  { key: 'balance', label: '資產負債', icon: Landmark },
  { key: 'cashflow', label: '收支明細', icon: Receipt },
  { key: 'goals', label: '目標規劃', icon: Target },
  { key: 'reports', label: '報告中心', icon: FileText },
] as const;

type TabKey = typeof tabs[number]['key'];

const COLORS = ['#c87941', '#4d7c5e', '#5b7fa5', '#9b9488'];

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>('info');
  const [showReport, setShowReport] = useState(false);

  const client = getClientById(id || '');

  if (!client) {
    return (
      <div className="text-center py-20">
        <p className="text-text-tertiary text-lg">找不到此客戶</p>
        <button
          onClick={() => navigate('/clients')}
          className="mt-4 text-accent-warm hover:text-accent-warm-hover font-medium"
        >
          回到客戶列表
        </button>
      </div>
    );
  }

  const totalAssets = getTotalAssets(client);
  const totalLiabilities = getTotalLiabilities(client);
  const netWorth = getNetWorth(client);
  const monthlyIncome = getTotalMonthlyIncome(client);
  const monthlyExpense = getTotalMonthlyExpense(client);
  const savingsRate = ((monthlyIncome - monthlyExpense) / monthlyIncome * 100).toFixed(1);

  const bankTotal = client.bankAccounts.reduce((s, a) => s + a.balance, 0);
  const investTotal = client.investments.reduce((s, i) => s + i.marketValue, 0);
  const insuranceCash = client.insurancePolicies.reduce((s, p) => s + p.cashValue, 0);

  const assetAllocation = [
    { name: '存款', value: bankTotal },
    { name: '投資', value: investTotal },
    { name: '保險現金價值', value: insuranceCash },
  ].filter((d) => d.value > 0);

  const incomeExpenseData = [
    { name: '月收入', 金額: monthlyIncome },
    { name: '月支出', 金額: monthlyExpense },
    { name: '月儲蓄', 金額: monthlyIncome - monthlyExpense },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/clients')}
          className="p-2 rounded-[var(--radius-sm)] hover:bg-bg-secondary text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-accent-warm/10 flex items-center justify-center text-accent-warm text-lg font-semibold">
            {client.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-text-primary">{client.name}</h1>
            <p className="text-sm text-text-tertiary">
              {client.age}歲 · {client.occupation} · 上次更新：{client.lastUpdated}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border-light overflow-x-auto">
        <div className="flex min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-accent-warm text-accent-warm'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border-medium'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div>
        {/* ── 基本資料 ── */}
        {activeTab === 'info' && (
          <div className="space-y-6">
            <div className="bg-bg-card border border-border-light rounded-[var(--radius-md)] p-6">
              <h3 className="text-base font-semibold text-text-primary font-sans mb-4">個人資訊</h3>
              <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                {[
                  ['姓名', client.name],
                  ['性別', client.gender],
                  ['出生日期', client.birthday],
                  ['年齡', `${client.age} 歲`],
                  ['電話', client.phone],
                  ['Email', client.email],
                  ['婚姻狀態', client.maritalStatus],
                  ['職業', client.occupation],
                  ['地址', client.address],
                ].map(([label, value]) => (
                  <div key={label} className="flex">
                    <span className="w-24 text-text-tertiary shrink-0">{label}</span>
                    <span className="text-text-primary">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {client.familyMembers.length > 0 && (
              <div className="bg-bg-card border border-border-light rounded-[var(--radius-md)] p-6">
                <h3 className="text-base font-semibold text-text-primary font-sans mb-4">家庭成員</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border-light text-text-tertiary">
                        <th className="text-left py-2 px-3 font-medium">姓名</th>
                        <th className="text-left py-2 px-3 font-medium">關係</th>
                        <th className="text-left py-2 px-3 font-medium">年齡</th>
                        <th className="text-left py-2 px-3 font-medium">職業</th>
                      </tr>
                    </thead>
                    <tbody>
                      {client.familyMembers.map((m, i) => (
                        <tr key={i} className="border-b border-border-light/50">
                          <td className="py-2.5 px-3 text-text-primary">{m.name}</td>
                          <td className="py-2.5 px-3 text-text-secondary">{m.relationship}</td>
                          <td className="py-2.5 px-3 text-text-secondary">{m.age}</td>
                          <td className="py-2.5 px-3 text-text-secondary">{m.occupation || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── 財務總覽 ── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: '總資產', value: totalAssets, color: 'text-accent-blue' },
                { label: '總負債', value: totalLiabilities, color: 'text-accent-red' },
                { label: '淨值', value: netWorth, color: 'text-accent-green' },
              ].map((item) => (
                <div key={item.label} className="bg-bg-card border border-border-light rounded-[var(--radius-md)] p-5">
                  <div className="text-sm text-text-tertiary mb-1">{item.label}</div>
                  <div className={`text-2xl font-semibold ${item.color}`}>
                    {formatCurrency(item.value)}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-bg-card border border-border-light rounded-[var(--radius-md)] p-5">
                <h3 className="text-base font-semibold text-text-primary font-sans mb-4">資產配置</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={assetAllocation}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      dataKey="value"
                      paddingAngle={3}
                      label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {assetAllocation.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: unknown) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-bg-card border border-border-light rounded-[var(--radius-md)] p-5">
                <h3 className="text-base font-semibold text-text-primary font-sans mb-4">月收支比較</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={incomeExpenseData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e8e3dc" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9b9488' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#9b9488' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                    <Tooltip formatter={(value: unknown) => formatCurrency(Number(value))} />
                    <Bar dataKey="金額" radius={[4, 4, 0, 0]} maxBarSize={50}>
                      <Cell fill="#4d7c5e" />
                      <Cell fill="#c4554d" />
                      <Cell fill="#5b7fa5" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ── 資產負債 ── */}
        {activeTab === 'balance' && (
          <div className="space-y-6">
            {/* Bank accounts */}
            <Section title="銀行帳戶">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-light text-text-tertiary">
                    <th className="text-left py-2 px-3 font-medium">銀行</th>
                    <th className="text-left py-2 px-3 font-medium">帳戶類型</th>
                    <th className="text-left py-2 px-3 font-medium">幣別</th>
                    <th className="text-right py-2 px-3 font-medium">餘額</th>
                  </tr>
                </thead>
                <tbody>
                  {client.bankAccounts.map((a) => (
                    <tr key={a.id} className="border-b border-border-light/50">
                      <td className="py-2.5 px-3 text-text-primary">{a.bank}</td>
                      <td className="py-2.5 px-3 text-text-secondary">{a.type}</td>
                      <td className="py-2.5 px-3 text-text-secondary">{a.currency}</td>
                      <td className="py-2.5 px-3 text-right text-text-primary font-medium">
                        {formatCurrency(a.balance)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-bg-secondary/30">
                    <td colSpan={3} className="py-2.5 px-3 font-medium text-text-primary">小計</td>
                    <td className="py-2.5 px-3 text-right font-semibold text-text-primary">
                      {formatCurrency(bankTotal)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* Investments */}
            <Section title="投資">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-light text-text-tertiary">
                    <th className="text-left py-2 px-3 font-medium">名稱</th>
                    <th className="text-left py-2 px-3 font-medium hidden sm:table-cell">類型</th>
                    <th className="text-right py-2 px-3 font-medium">成本</th>
                    <th className="text-right py-2 px-3 font-medium">市值</th>
                    <th className="text-right py-2 px-3 font-medium">損益</th>
                  </tr>
                </thead>
                <tbody>
                  {client.investments.map((inv) => {
                    const pnl = inv.marketValue - inv.cost;
                    return (
                      <tr key={inv.id} className="border-b border-border-light/50">
                        <td className="py-2.5 px-3 text-text-primary">{inv.name}</td>
                        <td className="py-2.5 px-3 text-text-secondary hidden sm:table-cell">{inv.type}</td>
                        <td className="py-2.5 px-3 text-right text-text-secondary">{formatCurrency(inv.cost)}</td>
                        <td className="py-2.5 px-3 text-right text-text-primary font-medium">
                          {formatCurrency(inv.marketValue)}
                        </td>
                        <td className={`py-2.5 px-3 text-right font-medium ${pnl >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                          {pnl >= 0 ? '+' : ''}{formatCurrency(pnl)}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-bg-secondary/30">
                    <td colSpan={2} className="py-2.5 px-3 font-medium text-text-primary">小計</td>
                    <td className="py-2.5 px-3 text-right font-medium text-text-secondary">
                      {formatCurrency(client.investments.reduce((s, i) => s + i.cost, 0))}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-text-primary">
                      {formatCurrency(investTotal)}
                    </td>
                    <td className={`py-2.5 px-3 text-right font-semibold ${investTotal - client.investments.reduce((s, i) => s + i.cost, 0) >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                      {investTotal - client.investments.reduce((s, i) => s + i.cost, 0) >= 0 ? '+' : ''}
                      {formatCurrency(investTotal - client.investments.reduce((s, i) => s + i.cost, 0))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* Insurance */}
            <Section title="保險保單">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-light text-text-tertiary">
                    <th className="text-left py-2 px-3 font-medium">保險公司</th>
                    <th className="text-left py-2 px-3 font-medium hidden sm:table-cell">險種</th>
                    <th className="text-right py-2 px-3 font-medium">保額</th>
                    <th className="text-right py-2 px-3 font-medium hidden md:table-cell">年繳保費</th>
                    <th className="text-right py-2 px-3 font-medium">現金價值</th>
                  </tr>
                </thead>
                <tbody>
                  {client.insurancePolicies.map((p) => (
                    <tr key={p.id} className="border-b border-border-light/50">
                      <td className="py-2.5 px-3 text-text-primary">{p.company}</td>
                      <td className="py-2.5 px-3 text-text-secondary hidden sm:table-cell">{p.type}</td>
                      <td className="py-2.5 px-3 text-right text-text-secondary">{formatCurrency(p.coverage)}</td>
                      <td className="py-2.5 px-3 text-right text-text-secondary hidden md:table-cell">{formatCurrency(p.annualPremium)}</td>
                      <td className="py-2.5 px-3 text-right text-text-primary font-medium">
                        {p.cashValue > 0 ? formatCurrency(p.cashValue) : '—'}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-bg-secondary/30">
                    <td colSpan={4} className="py-2.5 px-3 font-medium text-text-primary">現金價值小計</td>
                    <td className="py-2.5 px-3 text-right font-semibold text-text-primary">
                      {formatCurrency(insuranceCash)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* Loans */}
            {client.loans.length > 0 && (
              <Section title="貸款">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border-light text-text-tertiary">
                      <th className="text-left py-2 px-3 font-medium">類型</th>
                      <th className="text-left py-2 px-3 font-medium hidden sm:table-cell">貸款機構</th>
                      <th className="text-right py-2 px-3 font-medium">餘額</th>
                      <th className="text-right py-2 px-3 font-medium hidden md:table-cell">利率</th>
                      <th className="text-right py-2 px-3 font-medium">月付金</th>
                    </tr>
                  </thead>
                  <tbody>
                    {client.loans.map((l) => (
                      <tr key={l.id} className="border-b border-border-light/50">
                        <td className="py-2.5 px-3 text-text-primary">{l.type}</td>
                        <td className="py-2.5 px-3 text-text-secondary hidden sm:table-cell">{l.lender}</td>
                        <td className="py-2.5 px-3 text-right text-accent-red font-medium">{formatCurrency(l.balance)}</td>
                        <td className="py-2.5 px-3 text-right text-text-secondary hidden md:table-cell">{l.rate}%</td>
                        <td className="py-2.5 px-3 text-right text-text-primary">{formatCurrency(l.monthlyPayment)}</td>
                      </tr>
                    ))}
                    <tr className="bg-bg-secondary/30">
                      <td colSpan={2} className="py-2.5 px-3 font-medium text-text-primary">小計</td>
                      <td className="py-2.5 px-3 text-right font-semibold text-accent-red">
                        {formatCurrency(totalLiabilities)}
                      </td>
                      <td className="hidden md:table-cell" />
                      <td className="py-2.5 px-3 text-right font-semibold text-text-primary">
                        {formatCurrency(client.loans.reduce((s, l) => s + l.monthlyPayment, 0))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Section>
            )}

            {/* Net worth summary */}
            <div className="bg-bg-card border border-border-light rounded-[var(--radius-md)] p-5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-secondary">總資產</span>
                <span className="font-medium text-text-primary">{formatCurrency(totalAssets)}</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-text-secondary">總負債</span>
                <span className="font-medium text-accent-red">- {formatCurrency(totalLiabilities)}</span>
              </div>
              <div className="border-t border-border-light mt-3 pt-3 flex justify-between items-center">
                <span className="font-semibold text-text-primary">淨值</span>
                <span className="text-xl font-semibold text-accent-green">{formatCurrency(netWorth)}</span>
              </div>
            </div>
          </div>
        )}

        {/* ── 收支明細 ── */}
        {activeTab === 'cashflow' && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-bg-card border border-border-light rounded-[var(--radius-md)] p-5">
                <div className="text-sm text-text-tertiary mb-1">月總收入</div>
                <div className="text-2xl font-semibold text-accent-green">{formatCurrency(monthlyIncome)}</div>
              </div>
              <div className="bg-bg-card border border-border-light rounded-[var(--radius-md)] p-5">
                <div className="text-sm text-text-tertiary mb-1">月總支出</div>
                <div className="text-2xl font-semibold text-accent-red">{formatCurrency(monthlyExpense)}</div>
              </div>
              <div className="bg-bg-card border border-border-light rounded-[var(--radius-md)] p-5">
                <div className="text-sm text-text-tertiary mb-1">儲蓄率</div>
                <div className="text-2xl font-semibold text-accent-blue">{savingsRate}%</div>
              </div>
            </div>

            <Section title="收入明細">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-light text-text-tertiary">
                    <th className="text-left py-2 px-3 font-medium">來源</th>
                    <th className="text-left py-2 px-3 font-medium">類型</th>
                    <th className="text-left py-2 px-3 font-medium hidden sm:table-cell">頻率</th>
                    <th className="text-right py-2 px-3 font-medium">月均金額</th>
                  </tr>
                </thead>
                <tbody>
                  {client.incomes.map((inc) => (
                    <tr key={inc.id} className="border-b border-border-light/50">
                      <td className="py-2.5 px-3 text-text-primary">{inc.source}</td>
                      <td className="py-2.5 px-3 text-text-secondary">{inc.type}</td>
                      <td className="py-2.5 px-3 text-text-secondary hidden sm:table-cell">{inc.frequency}</td>
                      <td className="py-2.5 px-3 text-right text-accent-green font-medium">{formatCurrency(inc.monthlyAmount)}</td>
                    </tr>
                  ))}
                  <tr className="bg-bg-secondary/30">
                    <td colSpan={3} className="py-2.5 px-3 font-medium text-text-primary">合計</td>
                    <td className="py-2.5 px-3 text-right font-semibold text-accent-green">{formatCurrency(monthlyIncome)}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            <Section title="支出明細">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-light text-text-tertiary">
                    <th className="text-left py-2 px-3 font-medium">類別</th>
                    <th className="text-left py-2 px-3 font-medium hidden sm:table-cell">頻率</th>
                    <th className="text-right py-2 px-3 font-medium">月均金額</th>
                    <th className="text-center py-2 px-3 font-medium hidden sm:table-cell">必要支出</th>
                  </tr>
                </thead>
                <tbody>
                  {client.expenses.map((exp) => (
                    <tr key={exp.id} className="border-b border-border-light/50">
                      <td className="py-2.5 px-3 text-text-primary">{exp.category}</td>
                      <td className="py-2.5 px-3 text-text-secondary hidden sm:table-cell">{exp.frequency}</td>
                      <td className="py-2.5 px-3 text-right text-accent-red font-medium">{formatCurrency(exp.monthlyAmount)}</td>
                      <td className="py-2.5 px-3 text-center hidden sm:table-cell">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          exp.essential
                            ? 'bg-accent-blue/10 text-accent-blue'
                            : 'bg-bg-secondary text-text-tertiary'
                        }`}>
                          {exp.essential ? '必要' : '非必要'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-bg-secondary/30">
                    <td colSpan={2} className="py-2.5 px-3 font-medium text-text-primary">合計</td>
                    <td className="py-2.5 px-3 text-right font-semibold text-accent-red">{formatCurrency(monthlyExpense)}</td>
                    <td className="hidden sm:table-cell" />
                  </tr>
                </tbody>
              </table>
            </Section>
          </div>
        )}

        {/* ── 目標規劃 ── */}
        {activeTab === 'goals' && (
          <div className="grid sm:grid-cols-2 gap-4">
            {client.goals.map((goal) => {
              const pct = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
              const remaining = goal.targetAmount - goal.currentAmount;
              const targetDate = new Date(goal.targetDate);
              const now = new Date();
              const monthsLeft = Math.max(
                (targetDate.getFullYear() - now.getFullYear()) * 12 +
                  targetDate.getMonth() -
                  now.getMonth(),
                1
              );
              const monthlyNeeded = remaining > 0 ? Math.ceil(remaining / monthsLeft) : 0;

              return (
                <div
                  key={goal.id}
                  className="bg-bg-card border border-border-light rounded-[var(--radius-md)] p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-semibold text-text-primary font-sans">{goal.name}</h4>
                      <p className="text-xs text-text-tertiary mt-0.5">
                        目標日：{goal.targetDate} · 優先度：
                        <span className={
                          goal.priority === '高' ? 'text-accent-red' :
                          goal.priority === '中' ? 'text-accent-warm' : 'text-text-tertiary'
                        }>
                          {goal.priority}
                        </span>
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                      goal.category === '退休' ? 'bg-accent-blue/10 text-accent-blue' :
                      goal.category === '子女教育' ? 'bg-accent-green/10 text-accent-green' :
                      goal.category === '購屋' ? 'bg-accent-warm/10 text-accent-warm' :
                      'bg-bg-secondary text-text-tertiary'
                    }`}>
                      {goal.category}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs text-text-secondary mb-1.5">
                    <span>{formatCurrency(goal.currentAmount)}</span>
                    <span>{formatCurrency(goal.targetAmount)}</span>
                  </div>
                  <div className="w-full h-2.5 bg-bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all bg-accent-warm"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs">
                    <span className="text-accent-warm font-medium">{pct.toFixed(1)}% 已達成</span>
                    <span className="text-text-tertiary">
                      尚需每月存 {formatCurrency(monthlyNeeded)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── 報告中心 ── */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            {!showReport ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: '資產負債表', desc: '完整的資產與負債一覽', available: true },
                  { name: '現金流量表', desc: '月度收入與支出分析', available: true },
                  { name: '淨值變動表', desc: '期間內淨值增減分析', available: false },
                  { name: '保險需求分析', desc: '保障缺口與建議', available: false },
                  { name: '退休規劃報告', desc: '退休金缺口與建議', available: false },
                  { name: '投資組合分析', desc: '資產配置與績效', available: false },
                ].map((r) => (
                  <div
                    key={r.name}
                    className="bg-bg-card border border-border-light rounded-[var(--radius-md)] p-5 flex flex-col"
                  >
                    <h4 className="text-sm font-semibold text-text-primary font-sans">{r.name}</h4>
                    <p className="text-xs text-text-tertiary mt-1 mb-4 flex-1">{r.desc}</p>
                    <button
                      onClick={() => {
                        if (r.name === '資產負債表') {
                          setShowReport(true);
                        }
                      }}
                      disabled={!r.available}
                      className={`w-full py-2 rounded-[var(--radius-sm)] text-sm font-medium transition-colors ${
                        r.available
                          ? 'bg-accent-warm text-white hover:bg-accent-warm-hover'
                          : 'bg-bg-secondary text-text-tertiary cursor-not-allowed'
                      }`}
                    >
                      {r.available ? '產出報告' : '即將推出'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <button
                  onClick={() => setShowReport(false)}
                  className="mb-4 text-sm text-accent-warm hover:text-accent-warm-hover font-medium"
                >
                  ← 返回報告列表
                </button>
                <InlineBalanceSheet client={client} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Reusable Section component ──────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-bg-card border border-border-light rounded-[var(--radius-md)] p-5">
      <h3 className="text-base font-semibold text-text-primary font-sans mb-4">{title}</h3>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

// ─── Inline Balance Sheet ────────────────────────────────────────────

function InlineBalanceSheet({ client }: { client: ReturnType<typeof getClientById> }) {
  if (!client) return null;
  const bankTotal = client.bankAccounts.reduce((s, a) => s + a.balance, 0);
  const investTotal = client.investments.reduce((s, i) => s + i.marketValue, 0);
  const insuranceCash = client.insurancePolicies.reduce((s, p) => s + p.cashValue, 0);
  const totalAssets = bankTotal + investTotal + insuranceCash;
  const totalLiabilities = client.loans.reduce((s, l) => s + l.balance, 0);
  const netWorth = totalAssets - totalLiabilities;
  const today = new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="bg-white border border-border-light rounded-[var(--radius-md)] p-6 sm:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center border-b border-border-light pb-5 mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-7 h-7 rounded bg-accent-warm flex items-center justify-center text-white font-bold text-xs">F</div>
          <span className="font-serif font-semibold text-text-primary">FinOS 財策長</span>
        </div>
        <h2 className="text-xl font-semibold text-text-primary mt-3">個人資產負債表</h2>
        <p className="text-sm text-text-tertiary mt-1">
          客戶：{client.name} ｜ 報告日期：{today}
        </p>
      </div>

      {/* Assets */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-accent-green uppercase tracking-wider mb-3">資產 Assets</h3>

        <div className="mb-4">
          <div className="text-xs text-text-tertiary font-medium mb-2 uppercase tracking-wider">銀行存款</div>
          {client.bankAccounts.map((a) => (
            <div key={a.id} className="flex justify-between py-1.5 text-sm">
              <span className="text-text-secondary">{a.bank}（{a.type}）</span>
              <span className="text-text-primary">{formatCurrency(a.balance)}</span>
            </div>
          ))}
          <div className="flex justify-between py-1.5 text-sm font-medium border-t border-border-light/50 mt-1">
            <span>銀行存款小計</span>
            <span>{formatCurrency(bankTotal)}</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-xs text-text-tertiary font-medium mb-2 uppercase tracking-wider">投資</div>
          {client.investments.map((inv) => (
            <div key={inv.id} className="flex justify-between py-1.5 text-sm">
              <span className="text-text-secondary">{inv.name}</span>
              <span className="text-text-primary">{formatCurrency(inv.marketValue)}</span>
            </div>
          ))}
          <div className="flex justify-between py-1.5 text-sm font-medium border-t border-border-light/50 mt-1">
            <span>投資小計</span>
            <span>{formatCurrency(investTotal)}</span>
          </div>
        </div>

        {insuranceCash > 0 && (
          <div className="mb-4">
            <div className="text-xs text-text-tertiary font-medium mb-2 uppercase tracking-wider">保險現金價值</div>
            {client.insurancePolicies.filter(p => p.cashValue > 0).map((p) => (
              <div key={p.id} className="flex justify-between py-1.5 text-sm">
                <span className="text-text-secondary">{p.policyName}（{p.company}）</span>
                <span className="text-text-primary">{formatCurrency(p.cashValue)}</span>
              </div>
            ))}
            <div className="flex justify-between py-1.5 text-sm font-medium border-t border-border-light/50 mt-1">
              <span>保險現金價值小計</span>
              <span>{formatCurrency(insuranceCash)}</span>
            </div>
          </div>
        )}

        <div className="flex justify-between py-2.5 text-sm font-semibold border-t-2 border-accent-green/30 text-accent-green">
          <span>資產合計</span>
          <span>{formatCurrency(totalAssets)}</span>
        </div>
      </div>

      {/* Liabilities */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-accent-red uppercase tracking-wider mb-3">負債 Liabilities</h3>
        {client.loans.length > 0 ? (
          <>
            {client.loans.map((l) => (
              <div key={l.id} className="flex justify-between py-1.5 text-sm">
                <span className="text-text-secondary">{l.type}（{l.lender}）</span>
                <span className="text-text-primary">{formatCurrency(l.balance)}</span>
              </div>
            ))}
            <div className="flex justify-between py-2.5 text-sm font-semibold border-t-2 border-accent-red/30 text-accent-red">
              <span>負債合計</span>
              <span>{formatCurrency(totalLiabilities)}</span>
            </div>
          </>
        ) : (
          <p className="text-sm text-text-tertiary py-2">無負債</p>
        )}
      </div>

      {/* Net Worth */}
      <div className="border-t-2 border-text-primary pt-3">
        <div className="flex justify-between items-center">
          <span className="text-base font-semibold text-text-primary">淨值 Net Worth</span>
          <span className="text-xl font-bold text-accent-green">{formatCurrency(netWorth)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-border-light text-center">
        <p className="text-xs text-text-tertiary">
          本報告由 FinOS 財策長系統自動產出 · 僅供顧問諮詢參考用途
        </p>
      </div>
    </div>
  );
}
