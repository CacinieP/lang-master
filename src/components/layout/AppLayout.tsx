import type { ReactNode } from 'react';
import { Header } from './Header';
import { useUIStore } from '@/store/uiStore';
import './AppLayout.css';

export function AppLayout({ children }: { children: ReactNode }) {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  return (
    <div className="app-layout">
      <Header />
      <div className="app-body">
        <aside className={`app-sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
          {children}
        </aside>
        <main className="app-content">
          {/* Content rendered by parent */}
        </main>
      </div>
    </div>
  );
}
