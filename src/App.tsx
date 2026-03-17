import { Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import ClientList from './pages/ClientList';
import ClientDetail from './pages/ClientDetail';
import ReportView from './pages/ReportView';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="clients" element={<ClientList />} />
        <Route path="clients/:id" element={<ClientDetail />} />
        <Route path="reports/:clientId/:type" element={<ReportView />} />
        {/* Placeholder routes for nav items */}
        <Route path="reports" element={<PlaceholderPage title="報告中心" desc="報告中心功能開發中，請先透過客戶詳情頁面產出報告。" />} />
        <Route path="tools" element={<PlaceholderPage title="工具箱" desc="財務計算工具即將推出，敬請期待。" />} />
        <Route path="settings" element={<PlaceholderPage title="設定" desc="系統設定功能開發中。" />} />
      </Route>
    </Routes>
  );
}

function PlaceholderPage({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-2xl font-semibold text-text-primary mb-3">{title}</h1>
      <p className="text-text-secondary text-sm max-w-md">{desc}</p>
      <div className="mt-6 px-4 py-2 rounded-[var(--radius-sm)] bg-bg-secondary text-text-tertiary text-sm">
        Coming Soon
      </div>
    </div>
  );
}
