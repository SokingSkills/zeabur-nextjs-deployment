import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, AlertCircle, FileBarChart, Plus, FileText, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { advisor, clients } from '../data/mockData';

const metrics = [
  { label: '總客戶數', value: '5', icon: Users, color: 'bg-accent-blue/10 text-accent-blue' },
  { label: '本月新增', value: '1', icon: UserPlus, color: 'bg-accent-green/10 text-accent-green' },
  { label: '待更新客戶', value: '2', icon: AlertCircle, color: 'bg-accent-warm/10 text-accent-warm' },
  { label: '報告待產出', value: '3', icon: FileBarChart, color: 'bg-accent-red/10 text-accent-red' },
];

const recentActivities = [
  { id: 1, text: '新增客戶「黃家豪」', time: '2 天前', type: '新增' },
  { id: 2, text: '更新「陳怡君」財務資料', time: '1 週前', type: '更新' },
  { id: 3, text: '產出「林建宏」資產負債表', time: '2 週前', type: '報告' },
  { id: 4, text: '更新「張淑芬」退休規劃', time: '4 週前', type: '更新' },
  { id: 5, text: '新增「李美玲」保險保單', time: '2 個月前', type: '新增' },
];

const monthlyData = [
  { month: '2025/10', clients: 3 },
  { month: '2025/11', clients: 3 },
  { month: '2025/12', clients: 4 },
  { month: '2026/01', clients: 4 },
  { month: '2026/02', clients: 4 },
  { month: '2026/03', clients: 5 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? '早安' : hour < 18 ? '午安' : '晚安';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary mb-1">
            {greeting}，{advisor.name}顧問
          </h1>
          <p className="text-text-secondary text-sm">
            {advisor.company} · {new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/clients')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-sm)] bg-accent-warm text-white text-sm font-medium hover:bg-accent-warm-hover transition-colors"
          >
            <Plus size={16} />
            新增客戶
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-sm)] border border-border-medium text-text-secondary text-sm font-medium hover:bg-bg-secondary transition-colors">
            <FileText size={16} />
            產出報告
          </button>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="bg-bg-card border border-border-light rounded-[var(--radius-md)] p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-text-secondary">{m.label}</span>
              <div className={`w-9 h-9 rounded-[var(--radius-sm)] flex items-center justify-center ${m.color}`}>
                <m.icon size={18} />
              </div>
            </div>
            <div className="text-3xl font-semibold text-text-primary">{m.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Chart */}
        <div className="lg:col-span-3 bg-bg-card border border-border-light rounded-[var(--radius-md)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-text-tertiary" />
            <h2 className="text-base font-semibold text-text-primary font-sans">客戶成長趨勢</h2>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e3dc" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9b9488' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#9b9488' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fdfcfa',
                  border: '1px solid #e8e3dc',
                  borderRadius: '6px',
                  fontSize: '13px',
                }}
                formatter={(value: unknown) => [`${value} 位`, '客戶數']}
              />
              <Bar dataKey="clients" fill="#c87941" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent activity */}
        <div className="lg:col-span-2 bg-bg-card border border-border-light rounded-[var(--radius-md)] p-5">
          <h2 className="text-base font-semibold text-text-primary font-sans mb-4">近期活動</h2>
          <div className="space-y-3">
            {recentActivities.map((a) => (
              <div key={a.id} className="flex items-start gap-3">
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    a.type === '新增'
                      ? 'bg-accent-green'
                      : a.type === '更新'
                      ? 'bg-accent-blue'
                      : 'bg-accent-warm'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-text-primary">{a.text}</div>
                  <div className="text-xs text-text-tertiary mt-0.5">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Client quick list */}
      <div className="bg-bg-card border border-border-light rounded-[var(--radius-md)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-text-primary font-sans">客戶總覽</h2>
          <button
            onClick={() => navigate('/clients')}
            className="text-sm text-accent-warm hover:text-accent-warm-hover font-medium"
          >
            查看全部 →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-light text-text-tertiary">
                <th className="text-left py-2 px-3 font-medium">姓名</th>
                <th className="text-left py-2 px-3 font-medium hidden sm:table-cell">職業</th>
                <th className="text-right py-2 px-3 font-medium">淨值</th>
                <th className="text-right py-2 px-3 font-medium hidden sm:table-cell">上次更新</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => {
                const bankTotal = c.bankAccounts.reduce((s, a) => s + a.balance, 0);
                const investTotal = c.investments.reduce((s, i) => s + i.marketValue, 0);
                const insuranceCash = c.insurancePolicies.reduce((s, p) => s + p.cashValue, 0);
                const totalAssets = bankTotal + investTotal + insuranceCash;
                const totalLiab = c.loans.reduce((s, l) => s + l.balance, 0);
                const netWorth = totalAssets - totalLiab;

                return (
                  <tr
                    key={c.id}
                    className="border-b border-border-light/50 hover:bg-bg-secondary/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/clients/${c.id}`)}
                  >
                    <td className="py-3 px-3 font-medium text-text-primary">{c.name}</td>
                    <td className="py-3 px-3 text-text-secondary hidden sm:table-cell">{c.occupation}</td>
                    <td className="py-3 px-3 text-right text-text-primary">
                      NT$ {netWorth.toLocaleString('zh-TW')}
                    </td>
                    <td className="py-3 px-3 text-right text-text-tertiary hidden sm:table-cell">{c.lastUpdated}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
