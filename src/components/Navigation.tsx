import { Sparkles, AlertCircle, Info } from 'lucide-react';

interface NavigationProps {
  isConfigured: boolean;
  onShowSetupHelp: () => void;
}

export default function Navigation({ isConfigured, onShowSetupHelp }: NavigationProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#0D0D0F]/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Logo and App Title */}
        <div id="app-logo-section" className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-sans font-semibold tracking-tight text-white text-lg">AI Meeting Assistant</h1>
            <p className="text-xs text-slate-400 font-medium">Minutes of Meeting (MOM) & Intelligent Task Engine</p>
          </div>
        </div>

        {/* Global Key Status Banner & System Controls */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {!isConfigured ? (
            <button
              onClick={onShowSetupHelp}
              className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg text-xs font-semibold hover:bg-amber-500/20 transition cursor-pointer"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>API Key Required</span>
              <span className="underline ml-0.5">Setup Guide</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-semibold">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              <span>Gemini AI Connected</span>
            </div>
          )}

          <div className="hidden md:flex items-center gap-2 text-slate-400 font-mono text-xs px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg">
            <span>UTC Clock:</span>
            <span className="text-slate-300 font-medium">2026-05-25 05:50:27</span>
          </div>
        </div>
      </div>
    </header>
  );
}
