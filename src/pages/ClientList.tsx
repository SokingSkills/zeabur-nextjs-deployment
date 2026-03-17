import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, ArrowUpDown } from 'lucide-react';
import {
  clients,
  formatCurrency,
  getTotalAssets,
  getTotalLiabilities,
  getNetWorth,
} from '../data/mockData';

export default function ClientList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = clients.filter(
    (c) =>
      c.name.includes(search) ||
      c.occupation.includes(search) ||
      c.email.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-text-primary">客戶管理</h1>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-sm)] bg-accent-warm text-white text-sm font-medium hover:bg-accent-warm-hover transition-colors">
          <Plus size={16} />
          新增客戶
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
        <input
          type="text"
          placeholder="搜尋客戶姓名、職業、Email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-[var(--radius-sm)] border border-border-light bg-bg-card text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-warm/50 focus:ring-2 focus:ring-accent-warm/10 transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-bg-card border border-border-light rounded-[var(--radius-md)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-secondary/50 border-b border-border-light">
                <th className="text-left py-3 px-4 font-medium text-text-secondary">
                  <span className="inline-flex items-center gap-1">姓名 <ArrowUpDown size={12} /></span>
                </th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary hidden md:table-cell">年齡</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary hidden sm:table-cell">職業</th>
                <th className="text-right py-3 px-4 font-medium text-text-secondary">資產總額</th>
                <th className="text-right py-3 px-4 font-medium text-text-secondary hidden lg:table-cell">負債總額</th>
                <th className="text-right py-3 px-4 font-medium text-text-secondary hidden md:table-cell">淨值</th>
                <th className="text-right py-3 px-4 font-medium text-text-secondary hidden lg:table-cell">上次更新</th>
                <th className="text-center py-3 px-4 font-medium text-text-secondary">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const assets = getTotalAssets(c);
                const liabilities = getTotalLiabilities(c);
                const netWorth = getNetWorth(c);

                return (
                  <tr
                    key={c.id}
                    className="border-b border-border-light/50 hover:bg-bg-secondary/30 cursor-pointer transition-colors"
                    onClick={() => navigate(`/clients/${c.id}`)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent-warm/10 flex items-center justify-center text-accent-warm text-sm font-medium shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-text-primary">{c.name}</div>
                          <div className="text-xs text-text-tertiary sm:hidden">{c.occupation}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-text-secondary hidden md:table-cell">{c.age}</td>
                    <td className="py-3.5 px-4 text-text-secondary hidden sm:table-cell">{c.occupation}</td>
                    <td className="py-3.5 px-4 text-right text-text-primary font-medium">
                      {formatCurrency(assets)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-accent-red hidden lg:table-cell">
                      {liabilities > 0 ? formatCurrency(liabilities) : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium hidden md:table-cell">
                      <span className={netWorth >= 0 ? 'text-accent-green' : 'text-accent-red'}>
                        {formatCurrency(netWorth)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-text-tertiary hidden lg:table-cell">
                      {c.lastUpdated}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/clients/${c.id}`);
                        }}
                        className="text-accent-warm hover:text-accent-warm-hover text-sm font-medium"
                      >
                        查看
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-tertiary">
            找不到符合「{search}」的客戶
          </div>
        )}
      </div>

      {/* Count */}
      <div className="text-sm text-text-tertiary">
        共 {filtered.length} 位客戶
      </div>
    </div>
  );
}
