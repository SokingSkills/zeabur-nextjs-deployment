import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import { getClientById, formatCurrency } from '../data/mockData';

export default function ReportView() {
  const { clientId } = useParams<{ clientId: string; type: string }>();
  const navigate = useNavigate();

  const client = getClientById(clientId || '');

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

  const bankTotal = client.bankAccounts.reduce((s, a) => s + a.balance, 0);
  const investTotal = client.investments.reduce((s, i) => s + i.marketValue, 0);
  const insuranceCash = client.insurancePolicies.reduce((s, p) => s + p.cashValue, 0);
  const totalAssets = bankTotal + investTotal + insuranceCash;
  const totalLiabilities = client.loans.reduce((s, l) => s + l.balance, 0);
  const netWorth = totalAssets - totalLiabilities;
  const today = new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div>
      {/* Actions bar */}
      <div className="flex items-center justify-between mb-6 no-print">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          返回
        </button>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-sm)] bg-accent-warm text-white text-sm font-medium hover:bg-accent-warm-hover transition-colors"
        >
          <Printer size={16} />
          列印 / 匯出 PDF
        </button>
      </div>

      {/* Report */}
      <div className="bg-white border border-border-light rounded-[var(--radius-md)] p-6 sm:p-10 max-w-3xl mx-auto shadow-sm">
        {/* Header */}
        <div className="text-center border-b border-border-light pb-6 mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-accent-warm flex items-center justify-center text-white font-bold text-sm">
              F
            </div>
            <span className="font-serif font-semibold text-text-primary text-lg">FinOS 財策長</span>
          </div>
          <h1 className="text-2xl font-semibold text-text-primary mt-4">個人資產負債表</h1>
          <p className="text-sm text-text-secondary mt-2">Balance Sheet</p>
        </div>

        {/* Client info */}
        <div className="grid grid-cols-2 gap-4 text-sm mb-8 bg-bg-secondary/50 rounded-[var(--radius-sm)] p-4">
          <div>
            <span className="text-text-tertiary">客戶姓名：</span>
            <span className="text-text-primary font-medium">{client.name}</span>
          </div>
          <div>
            <span className="text-text-tertiary">報告日期：</span>
            <span className="text-text-primary font-medium">{today}</span>
          </div>
          <div>
            <span className="text-text-tertiary">顧問：</span>
            <span className="text-text-primary font-medium">王志明 CFP®</span>
          </div>
          <div>
            <span className="text-text-tertiary">事務所：</span>
            <span className="text-text-primary font-medium">明智財務顧問事務所</span>
          </div>
        </div>

        {/* Assets */}
        <div className="mb-8">
          <h2 className="text-base font-semibold text-accent-green border-b-2 border-accent-green/30 pb-2 mb-4">
            壹、資產 Assets
          </h2>

          <ReportSection title="一、銀行存款">
            {client.bankAccounts.map((a) => (
              <ReportRow key={a.id} label={`${a.bank}（${a.type}）`} value={a.balance} />
            ))}
            <ReportSubtotal label="銀行存款小計" value={bankTotal} />
          </ReportSection>

          <ReportSection title="二、投資資產">
            {client.investments.map((inv) => (
              <ReportRow key={inv.id} label={`${inv.name}（${inv.type}）`} value={inv.marketValue} />
            ))}
            <ReportSubtotal label="投資資產小計" value={investTotal} />
          </ReportSection>

          {insuranceCash > 0 && (
            <ReportSection title="三、保險現金價值">
              {client.insurancePolicies
                .filter((p) => p.cashValue > 0)
                .map((p) => (
                  <ReportRow key={p.id} label={`${p.policyName}（${p.company}）`} value={p.cashValue} />
                ))}
              <ReportSubtotal label="保險現金價值小計" value={insuranceCash} />
            </ReportSection>
          )}

          <div className="flex justify-between py-3 text-sm font-bold border-t-2 border-accent-green text-accent-green mt-4">
            <span>資產合計</span>
            <span>{formatCurrency(totalAssets)}</span>
          </div>
        </div>

        {/* Liabilities */}
        <div className="mb-8">
          <h2 className="text-base font-semibold text-accent-red border-b-2 border-accent-red/30 pb-2 mb-4">
            貳、負債 Liabilities
          </h2>

          {client.loans.length > 0 ? (
            <>
              {client.loans.map((l) => (
                <div key={l.id} className="mb-3">
                  <ReportRow label={`${l.type}（${l.lender}，利率 ${l.rate}%）`} value={l.balance} />
                  <div className="text-xs text-text-tertiary pl-2 mt-0.5">
                    月付金 {formatCurrency(l.monthlyPayment)} · 到期日 {l.endDate}
                  </div>
                </div>
              ))}
              <div className="flex justify-between py-3 text-sm font-bold border-t-2 border-accent-red text-accent-red mt-4">
                <span>負債合計</span>
                <span>{formatCurrency(totalLiabilities)}</span>
              </div>
            </>
          ) : (
            <p className="text-sm text-text-tertiary py-3">無負債</p>
          )}
        </div>

        {/* Net Worth */}
        <div className="border-t-2 border-text-primary pt-4 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-text-primary">淨值 Net Worth</span>
            <span className="text-2xl font-bold text-accent-green">{formatCurrency(netWorth)}</span>
          </div>
          <p className="text-xs text-text-tertiary mt-2">
            淨值 = 資產合計 − 負債合計 = {formatCurrency(totalAssets)} − {formatCurrency(totalLiabilities)}
          </p>
        </div>

        {/* Footer */}
        <div className="border-t border-border-light pt-6 text-center space-y-1">
          <p className="text-xs text-text-tertiary">
            本報告由 FinOS 財策長系統自動產出，資料截止日：{today}
          </p>
          <p className="text-xs text-text-tertiary">
            本報告僅供理財規劃顧問諮詢參考之用途，不構成任何投資建議
          </p>
          <p className="text-xs text-text-tertiary mt-3">
            明智財務顧問事務所 · 王志明 CFP® · 02-2712-8899
          </p>
        </div>
      </div>
    </div>
  );
}

function ReportSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="text-sm font-medium text-text-secondary mb-2">{title}</div>
      {children}
    </div>
  );
}

function ReportRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between py-1.5 text-sm pl-2">
      <span className="text-text-secondary">{label}</span>
      <span className="text-text-primary">{formatCurrency(value)}</span>
    </div>
  );
}

function ReportSubtotal({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between py-2 text-sm font-medium border-t border-border-light/50 mt-1 pl-2">
      <span className="text-text-primary">{label}</span>
      <span className="text-text-primary">{formatCurrency(value)}</span>
    </div>
  );
}
