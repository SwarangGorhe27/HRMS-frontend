import { useUIStore } from '@store/uiStore';
import { DockBar } from '@components/dock/DockBar';
import { TopBar } from './TopBar';
import { WorkspaceCanvas } from './WorkspaceCanvas';
import { ModulePanel } from '@components/panels/ModulePanel';
import { Dashboard } from './Dashboard';
import { EssDashboard } from './EssDashboard';
import { MyProfilePage } from '@pages/MyProfilePage';
import { SetupPasswordPage } from '@pages/SetupPasswordPage';

export function AppShell() {
  const panelOpen = useUIStore((state) => state.panelOpen);
  const currentPage = useUIStore((state) => state.currentPage);
  const portal = useUIStore((state) => state.portal);

  // Route: /setup-password?token=xxx — standalone page (no topbar/dock)
  if (window.location.pathname === '/setup-password') {
    return <SetupPasswordPage />;
  }

  let content: React.ReactNode;
  if (panelOpen) {
    content = <ModulePanel />;
  } else if (currentPage === 'my-profile') {
    content = <MyProfilePage />;
  } else {
    content = portal === 'ess' ? <EssDashboard /> : <Dashboard />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <WorkspaceCanvas>{content}</WorkspaceCanvas>
      <DockBar />
    </div>
  );
}
