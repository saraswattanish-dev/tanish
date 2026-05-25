import React from 'react';
import { 
  Sparkles, 
  LayoutDashboard, 
  CheckSquare, 
  Video, 
  BarChart3, 
  Settings, 
  LogOut, 
  User, 
  Clock, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'dashboard' | 'tasks' | 'meet' | 'analytics' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'tasks' | 'meet' | 'analytics' | 'settings') => void;
  currentUser: { name: string; email: string } | null;
  onLogout: () => void;
  isConfigured: boolean;
  onShowSetupHelp: () => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  currentUser, 
  onLogout, 
  isConfigured, 
  onShowSetupHelp 
}: SidebarProps) {
  const menuItems = [
    { id: 'dashboard' as const, label: 'Meetings Workspace', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'tasks' as const, label: 'Global Task Board', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'meet' as const, label: 'Google Meet Sync', icon: <Video className="w-4 h-4" /> },
    { id: 'analytics' as const, label: 'Team Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings' as const, label: 'AI Configuration', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <aside id="dashboard-sidebar" className="w-full lg:w-64 bg-[#121214] border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col justify-between p-6 h-auto lg:h-[calc(100vh-73px)] shrink-0 font-sans">
      <div className="space-y-6">
        {/* User Info Capsule */}
        <div className="bg-[#18181B] rounded-2xl p-4 border border-white/5 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center justify-center border border-indigo-400/20 shadow-md">
              {currentUser ? currentUser.name.split(' ').map(n=>n[0]).join('') : "US"}
            </div>
            <div className="truncate min-w-0">
              <span className="block text-xs font-semibold text-white truncate">{currentUser ? currentUser.name : "Active Scholar"}</span>
              <span className="block text-[10px] text-slate-500 truncate">{currentUser ? currentUser.email : "demo@workspace.com"}</span>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-2 flex items-center justify-between text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
            <span>Quota Status</span>
            <span className="text-emerald-400">Pro Active</span>
          </div>
        </div>

        {/* Menu Navigation Items */}
        <nav className="space-y-1.5">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pb-1.5 px-3">Management</p>
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="space-y-4 pt-6 lg:pt-0">
        {/* Connection status card info */}
        <div className="bg-[#18181b]/50 border border-white/5 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
            <span>Gemini Node</span>
            <span className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
          </div>
          {isConfigured ? (
            <p className="text-[10px] text-slate-500 leading-normal">
              Fully active server-side models configured for audio processing.
            </p>
          ) : (
            <div className="space-y-1.5">
              <p className="text-[10px] text-amber-500/90 leading-normal font-medium">
                Gemini API Key missing. Simulation engine will run.
              </p>
              <button 
                onClick={onShowSetupHelp}
                className="underline text-[10px] text-indigo-400 hover:text-indigo-300 font-bold block"
              >
                Access API Guide
              </button>
            </div>
          )}
        </div>

        {/* Logout action */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Workspace</span>
        </button>
      </div>
    </aside>
  );
}
