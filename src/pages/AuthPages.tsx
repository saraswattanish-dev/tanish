import React, { useState } from 'react';
import { Sparkles, ArrowRight, Lock, Mail, User, ShieldCheck, AlertCircle } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, googleSignInWithScopes } from '../firebase';
import firebaseConfig from '../../firebase-applet-config.json';

interface AuthPagesProps {
  onAuthSuccess: (email: string, userName: string) => void;
  onBackToLanding: () => void;
}

export default function AuthPages({ onAuthSuccess, onBackToLanding }: AuthPagesProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    if (!email || !password || (!isLogin && !name)) {
      setErrorMsg("Please fill in all mandatory account parameters.");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // Real Login using Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const displayName = userCredential.user.displayName || userCredential.user.email?.split('@')[0] || "User";
        onAuthSuccess(userCredential.user.email || email, displayName);
      } else {
        // Real Signup using Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Update user profile display name
        await updateProfile(userCredential.user, { displayName: name });
        onAuthSuccess(userCredential.user.email || email, name);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      let descriptiveMessage = err.message;
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        descriptiveMessage = "Invalid credentials. Please verify your email and password.";
      } else if (err.code === 'auth/email-already-in-use') {
        descriptiveMessage = "This email is already registered. Try logging in instead.";
      } else if (err.code === 'auth/weak-password') {
        descriptiveMessage = "Password is too weak. Please use at least 6 characters.";
      } else if (err.code === 'auth/invalid-email') {
        descriptiveMessage = "Please enter a valid work email address.";
      } else if (err.code === 'auth/operation-not-allowed' || (err.message && err.message.includes('operation-not-allowed'))) {
        descriptiveMessage = "OPERATION_NOT_ALLOWED_ERROR";
      }
      setErrorMsg(descriptiveMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const { user } = await googleSignInWithScopes([
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events"
      ]);
      const displayName = user.displayName || user.email?.split('@')[0] || "User";
      onAuthSuccess(user.email || "", displayName);
    } catch (err: any) {
      console.error("Google Sign-In Error:", err);
      if (err.code === 'auth/unauthorized-domain' || (err.message && err.message.includes('unauthorized-domain'))) {
        setErrorMsg("UNAUTHORIZED_DOMAIN_ERROR");
      } else if (err.code === 'auth/popup-closed-by-user' || (err.message && err.message.includes('popup-closed-by-user'))) {
        setErrorMsg("POPUP_CLOSED_ERROR");
      } else {
        setErrorMsg(err.message || "Could not connect to Google accounts. Let's try standard credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#08080A] text-slate-100 min-h-screen font-sans flex flex-col justify-between selection:bg-indigo-5050/30">
      {/* Header bar */}
      <header className="py-6 px-6 border-b border-white/5 bg-[#08080A]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div 
            onClick={onBackToLanding}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition"
          >
            <div className="p-2.5 bg-indigo-600 text-white rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-sans font-bold text-white text-sm tracking-tight">AI Meeting Assistant</span>
          </div>
          <button 
            onClick={onBackToLanding}
            className="text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </header>

      {/* Main card */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="bg-[#121214] max-w-sm w-full rounded-2xl border border-white/5 p-8 relative z-10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-sans font-bold text-white text-xl">
              {isLogin ? "Welcome back" : "Create corporate account"}
            </h2>
            <p className="text-xs text-slate-500">
              {isLogin ? "Sign in to access secure transcribed MOM dashboards" : "Start structuring your administrative workspaces free"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-600" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2 bg-white/[0.02] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-xs text-slate-100 placeholder-slate-600"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-600" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2 bg-white/[0.02] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-xs text-slate-100 placeholder-slate-600"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Account Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-600" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2 bg-white/[0.02] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-xs text-slate-100 placeholder-slate-600"
                />
              </div>
            </div>

            {errorMsg === "UNAUTHORIZED_DOMAIN_ERROR" ? (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-3 text-amber-200 text-xs leading-relaxed animate-in fade-in duration-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5 text-amber-400" />
                  <div>
                    <strong className="text-white block font-sans font-bold">Authorized Domain Required</strong>
                    <span>Firebase blocks OAuth because this custom or production domain hasn't been added to your authorized domains.</span>
                  </div>
                </div>
                <div className="bg-black/30 p-2.5 rounded-lg border border-white/5 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-bold block">Domain to authorize:</span>
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-indigo-300 font-mono text-[10px] select-all break-all">{window.location.hostname}</code>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.hostname);
                        alert("Domain " + window.location.hostname + " copied to clipboard!");
                      }}
                      className="text-[9px] bg-white/5 hover:bg-white/10 text-white font-bold px-2 py-1 rounded transition whitespace-nowrap cursor-pointer select-none"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5 font-medium text-slate-300 text-[11px]">
                  <p className="font-bold text-white uppercase text-[9px] tracking-widest text-[#EAB308]">How to fix in Firebase Console:</p>
                  <ol className="list-decimal pl-4 space-y-1 text-slate-300">
                    <li>Go to the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline font-bold">Firebase Console</a></li>
                    <li>Select project: <code className="bg-white/5 text-indigo-300 px-1.5 py-0.5 rounded leading-none text-[10px] font-mono">{firebaseConfig.projectId}</code></li>
                    <li>Navigate to: <strong>Authentication</strong> &rarr; <strong>Settings</strong> &rarr; <strong>Authorized domains</strong></li>
                    <li>Click <strong>Add domain</strong> and paste the copied address (<code className="text-indigo-300 text-[10px] font-mono">{window.location.hostname}</code>)</li>
                  </ol>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorMsg(null)}
                  className="w-full text-center text-[10px] text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wider block pt-1 bg-transparent border-0 cursor-pointer"
                >
                  Dismiss &amp; Try Again
                </button>
              </div>
            ) : errorMsg === "POPUP_CLOSED_ERROR" ? (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-3 text-amber-200 text-xs leading-relaxed animate-in fade-in duration-200 animate-duration-300">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5 text-amber-400" />
                  <div>
                    <strong className="text-white block font-sans font-bold text-xs">Popup Closed or Domain Rejected</strong>
                    <span className="text-[11px] text-slate-300">The sign-in popup closed before completion. If this happened immediately without showing standard account selection, it means this production domain must be authorized in your Firebase console.</span>
                  </div>
                </div>

                <div className="bg-black/30 p-2 text-[11px] text-slate-300 rounded-lg border border-white/5 space-y-1.5">
                  <p className="font-bold text-white uppercase text-[9px] tracking-widest text-[#EAB308]">How to fix in Firebase Console:</p>
                  <ol className="list-decimal pl-4 space-y-1 text-slate-300 text-[10.5px]">
                    <li>Open <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline font-semibold hover:text-indigo-300">Firebase Console</a></li>
                    <li>Select: <code className="bg-white/5 text-indigo-300 px-1 py-0.5 rounded text-[10px] font-mono">{firebaseConfig.projectId}</code></li>
                    <li>Go to: <strong>Authentication</strong> &rarr; <strong>Settings</strong> &rarr; <strong>Authorized domains</strong></li>
                    <li>Click <strong>Add domain</strong> and paste:</li>
                  </ol>
                  <div className="flex items-center justify-between gap-1.5 mt-2 bg-black/40 p-1.5 rounded border border-white/5">
                    <code className="text-indigo-300 font-mono text-[9.5px] select-all break-all">{window.location.hostname}</code>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.hostname);
                        alert("Domain " + window.location.hostname + " copied to clipboard!");
                      }}
                      className="text-[9px] bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-1.5 py-0.5 rounded transition whitespace-nowrap cursor-pointer select-none"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 border-t border-white/5 pt-2 space-y-1.5 leading-normal">
                  <p className="text-white font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span>To avoid popups altogether:</span>
                  </p>
                  <p className="text-slate-300">
                    Use our standard <strong>Email &amp; Password</strong> fields above! It avoids browser popups completely and registers instantly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg(null);
                    }}
                    className="w-full mt-1.5 py-2 bg-indigo-600/20 hover:bg-indigo-600/35 border border-indigo-500/20 text-indigo-300 font-bold rounded-lg text-[10px] uppercase tracking-wider transition cursor-pointer"
                  >
                    Use Standard Email &amp; Password fields
                  </button>
                </div>

                <div className="text-[10px] text-slate-400 border-t border-white/5 pt-2 space-y-0.5 leading-normal">
                  <p className="text-white font-semibold">Other reasons:</p>
                  <ul className="list-disc pl-3.5 space-y-0.5">
                    <li>An adblocker or popup-blocker might have terminated the window automatically.</li>
                    <li>You or the browser may have closed the pop-up before the token authorization finished.</li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => setErrorMsg(null)}
                  className="w-full text-center text-[10px] text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wider block pt-1 bg-transparent border-0 cursor-pointer"
                >
                  Dismiss &amp; Try Again
                </button>
              </div>
            ) : errorMsg === "OPERATION_NOT_ALLOWED_ERROR" ? (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-3 text-amber-200 text-xs leading-relaxed animate-in fade-in duration-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5 text-amber-400" />
                  <div>
                    <strong className="text-white block font-sans font-bold">Email/Password Provider Disabled</strong>
                    <span>Firebase Authentication blocks email registrations because the standard Email/Password sign-in method hasn't been enabled in your Firebase project.</span>
                  </div>
                </div>
                <div className="space-y-1.5 font-medium text-slate-300 text-[11px]">
                  <p className="font-bold text-white uppercase text-[9px] tracking-widest text-[#EAB308]">How to enable in Firebase Console:</p>
                  <ol className="list-decimal pl-4 space-y-1 text-slate-300">
                    <li>Go to the <a href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/providers`} target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline font-bold">Firebase Authentication Console</a></li>
                    <li>Make sure you are on project: <code className="bg-white/5 text-indigo-300 px-1.5 py-0.5 rounded leading-none text-[10px] font-mono">{firebaseConfig.projectId}</code></li>
                    <li>Click on the <strong>Sign-in method</strong> tab (or click <strong>Get started</strong> if setting up for the first time)</li>
                    <li>Click <strong>Add new provider</strong> and choose <strong>Email/Password</strong></li>
                    <li>Toggle "Enable" to on, and click <strong>Save</strong>.</li>
                  </ol>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorMsg(null)}
                  className="w-full text-center text-[10px] text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wider block pt-1 bg-transparent border-0 cursor-pointer"
                >
                  Dismiss &amp; Try Again
                </button>
              </div>
            ) : errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/15 rounded-xl flex gap-1.5 text-rose-400 text-[11px] font-medium leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <div className="space-y-1.5">
                  <span>{errorMsg}</span>
                  {(errorMsg.includes("operation-not-allowed") || errorMsg.includes("disabled")) && (
                    <p className="text-[10px] text-rose-300 mt-1 leading-relaxed">
                      Tip: Ensure you have enabled the <strong>Email/Password</strong> provider in your <a href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/providers`} target="_blank" rel="noopener noreferrer" className="underline font-bold text-indigo-300">Firebase Console (project: {firebaseConfig.projectId})</a>.
                    </p>
                  )}
                  {errorMsg.includes("unauthorized-domain") && (
                    <p className="text-[10px] text-rose-300 mt-1 leading-relaxed">
                      Tip: You must add <code className="bg-white/5 px-1 py-0.5 rounded font-mono text-[9px]">{window.location.hostname}</code> to <strong>Authorized Domains</strong> in your <a href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/settings`} target="_blank" rel="noopener noreferrer" className="underline font-bold text-indigo-300">Firebase Console (Settings tab)</a>.
                    </p>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/15 disabled:opacity-50"
            >
              <span>{loading ? "Processing..." : (isLogin ? "Sign In to Dashboard" : "Create Free Account")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="relative flex items-center justify-center py-1">
            <span className="absolute inset-x-0 h-px bg-white/5"></span>
            <span className="relative bg-[#121214] px-3 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              Or Connect Google Token
            </span>
          </div>

          {/* Official Google Button Style */}
          <button 
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold transition cursor-pointer select-none disabled:opacity-50"
          >
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4 shrink-0">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            </svg>
            <span>Sign In with Google Workspace</span>
          </button>

          <p className="text-center text-[10px] text-slate-500 font-medium font-sans">
            {isLogin ? "New to AI Assistant? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setErrorMsg(null); }}
              className="text-indigo-400 hover:underline font-bold"
            >
              {isLogin ? "Register Core Node" : "Login Securely"}
            </button>
          </p>

          <div className="flex items-center gap-1.5 text-[9px] text-slate-600 justify-center border-t border-white/5 pt-4">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
            <span>Encrypted with SHA-256 Workspace standards</span>
          </div>
        </div>
      </main>

      {/* Footer bar */}
      <footer className="py-6 border-t border-white/5 bg-[#050507] text-center text-[10px] text-slate-600">
        <p>© 2026 AI CRM and Meeting Assistant Dashboard. Protected Workspace Security schemas.</p>
      </footer>
    </div>
  );
}
