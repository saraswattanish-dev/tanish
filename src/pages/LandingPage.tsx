import React from 'react';
import { 
  Sparkles, 
  Mic, 
  Clock, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  ArrowUpRight, 
  Activity, 
  FileText, 
  ShieldCheck, 
  MessageSquare, 
  Layers, 
  Zap, 
  Users,
  Video
} from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onEnterApp: () => void;
  onEnterLogin: () => void;
}

export default function LandingPage({ onEnterApp, onEnterLogin }: LandingPageProps) {
  // Mock testimonials
  const testimonials = [
    {
      quote: "AI Meeting Assistant saves our product team over 5 hours every single week. The automated task assignment is shockingly accurate.",
      author: "Marcus Vance",
      role: "Lead Product Designer, CloudScale",
      avatar: "MV"
    },
    {
      quote: "We use the Google Meet auto-integration and tab audio capture for all our board alignments. The executive summary is stellar.",
      author: "Sarah Jenkins",
      role: "VP Marketing, GrowAI",
      avatar: "SJ"
    },
    {
      quote: "No more designated note-takers. We just start recording, speak naturally, and let Gemini handle everything in pristine dark UI.",
      author: "Devon Thorne",
      role: "Engineering Principal, VoxelTech",
      avatar: "DT"
    }
  ];

  // Pricing plans
  const pricingPlans = [
    {
      name: "Starter",
      price: "$0",
      description: "Perfect for personal meetings and trying out smart synthesis.",
      features: [
        "Up to 10 meetings / month",
        "Gemini AI Web Transcription",
        "Basic executive summaries",
        "Client-side local task-boards",
        "PDF MOM standard exports"
      ],
      cta: "Start Free",
      isPopular: false
    },
    {
      name: "SaaS Premium",
      price: "$19",
      period: "/month",
      description: "Ideal for growing teams seeking instant workspace automation.",
      features: [
        "Unlimited transcription time",
        "Real-time Browser Tab Audio Capture",
        "Google Meet integration & creation",
        "Smart task auto-assignment",
        "Collaborator analytics & priority graphs",
        "Enhanced printable PDF MOM formats"
      ],
      cta: "Get Premium Now",
      isPopular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For security-minded corporations needing dedicated nodes.",
      features: [
        "Dedicated database clusters",
        "Advanced Firebase Authentication",
        "Whisper & Gemini custom training",
        "Dedicated corporate OAuth space",
        "Unlimited members & workspaces",
        "24/7 Priority engineer support"
      ],
      cta: "Contact Sales",
      isPopular: false
    }
  ];

  const features = [
    {
      icon: <Mic className="w-5 h-5 text-indigo-400" />,
      title: "Lossless Tab Audio Capture",
      desc: "Capture direct browser tab streams with loopback recording. Say goodbye to room noise and overlapping speaker echo."
    },
    {
      icon: <Sparkles className="w-5 h-5 text-sky-400" />,
      title: "Gemini-3.5 Intelligence",
      desc: "Extract executive memos, highlights, important decisions, and due tasks automatically with advanced LLM analysis."
    },
    {
      icon: <Layers className="w-5 h-5 text-emerald-400" />,
      title: "Team Workload Analytics",
      desc: "See who's assigned what in real-time. Balance workload with elegant data visualizations and productivity charts."
    },
    {
      icon: <Video className="w-5 h-5 text-pink-400" />,
      title: "Google Meet Core Sync",
      desc: "Schedule and spin up verified Google Meet session spaces in one-click directly from your secure assistant dashboard."
    },
    {
      icon: <FileText className="w-5 h-5 text-amber-400" />,
      title: "Pristine Printable MOM PDFs",
      desc: "Export professionally formats of meeting details suited for executive review. Clean borders, signatures, and indexes."
    },
    {
      icon: <Lock className="w-5 h-5 text-indigo-400" />,
      title: "Strict Data Governance",
      desc: "In-memory credentials caching, zero unsolicited server tracking, and clean browser session boundaries."
    }
  ];

  return (
    <div className="bg-[#08080A] text-slate-100 min-h-screen font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Navbar overlay */}
      <nav className="sticky top-0 z-50 bg-[#08080A]/80 backdrop-blur-md border-b border-white/5 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/10">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-sans font-bold text-white text-base tracking-tight">AI Meeting Assistant</span>
              <span className="hidden sm:inline-block ml-2 text-[9px] bg-indigo-500/10 text-indigo-400 font-bold px-2 py-0.5 rounded border border-indigo-500/15 uppercase tracking-wide">SaaS v1.4</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-400">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#workflow" className="hover:text-white transition">Workflow</a>
            <a href="#testimonials" className="hover:text-white transition">Testimonials</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={onEnterLogin}
              className="text-xs font-bold text-slate-300 hover:text-white px-2 py-1.5 transition cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={onEnterApp}
              className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 px-4 rounded-xl transition shadow-lg shadow-indigo-600/15 cursor-pointer"
            >
              <span>Launch App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28 px-6 border-b border-white/5">
        {/* Background Gradients & Ambient Lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-sky-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-indigo-500/20"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Introducing Real-time Browser Core Transcribing</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-sans text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.05] max-w-4xl mx-auto"
          >
            Capture every meeting word.<br />
            <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
              Drive instant team action.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            The premium full-stack AI platform to record browser audio, transcribe instantly using Gemini AI models, extract decision nodes, and assign task boards seamlessly in smart SaaS dashboards.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={onEnterApp}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl transition text-sm shadow-xl shadow-indigo-600/20 cursor-pointer w-full sm:w-auto justify-center"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onEnterLogin}
              className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-slate-300 font-bold px-6 py-3 rounded-xl transition text-sm cursor-pointer border border-white/5 w-full sm:w-auto justify-center"
            >
              <span>Request Pro Demo</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </button>
          </motion.div>

          {/* Interactive Metric Pillows */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-10 text-left font-sans"
          >
            <div className="bg-[#121214]/40 border border-white/5 p-4 rounded-2xl">
              <span className="block text-xl font-bold text-white">99.2%</span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Gemini Accuracy</span>
            </div>
            <div className="bg-[#121214]/40 border border-white/5 p-4 rounded-2xl">
              <span className="block text-xl font-bold text-white">5.4 hrs</span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Saved Weekly</span>
            </div>
            <div className="bg-[#121214]/40 border border-white/5 p-4 rounded-2xl">
              <span className="block text-xl font-bold text-white">1 Click</span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Google Meet Link</span>
            </div>
            <div className="bg-[#121214]/40 border border-white/5 p-4 rounded-2xl">
              <span className="block text-xl font-bold text-white">Zero</span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Echo Lag Issues</span>
            </div>
          </motion.div>
        </div>

        {/* Dashboard Frame Preview */}
        <div className="max-w-5xl mx-auto mt-16 relative">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 opacity-20 blur-xl"></div>
          <div className="relative bg-[#121214] border border-white/10 rounded-2xl shadow-2xl overflow-hidden aspect-[16/10] p-1.5">
            <div className="w-full h-full bg-[#0A0A0B] rounded-xl overflow-hidden flex flex-col border border-white/5">
              {/* Fake Chrome window bar */}
              <div className="bg-[#121214] px-4 py-2.5 flex items-center justify-between border-b border-white/5 text-[10px] text-slate-500 select-none">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/40"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/40"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40"></span>
                </div>
                <div className="bg-black/20 text-[9px] px-3 py-0.5 rounded-md border border-white/5 w-60 text-center font-mono truncate">
                  ai-meeting-assistant.app/workspace
                </div>
                <span className="w-6"></span>
              </div>
              
              {/* Dynamic Inner Simulated Dashboard Visuals */}
              <div className="flex-1 p-6 grid grid-cols-12 gap-4">
                <div className="col-span-4 bg-[#121214] rounded-xl p-4 border border-white/5 space-y-3">
                  <div className="w-20 h-4 bg-white/5 rounded"></div>
                  <div className="space-y-2">
                    <div className="w-full h-10 bg-indigo-500/5 border border-indigo-500/10 rounded-lg flex items-center px-2.5 justify-between">
                      <div className="w-24 h-2 bg-indigo-400/35 rounded"></div>
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                    </div>
                    <div className="w-full h-10 bg-white/[0.02] border border-white/5 rounded-lg flex items-center px-2.5">
                      <div className="w-28 h-2 bg-slate-600/35 rounded"></div>
                    </div>
                  </div>
                </div>

                <div className="col-span-8 bg-[#121214] rounded-xl p-4 border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-32 h-4 bg-white/5 rounded"></div>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[8px] rounded uppercase font-bold tracking-wider">AI Synced</span>
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="h-2 bg-slate-500/10 w-full rounded"></div>
                    <div className="h-2 bg-slate-500/10 w-11/12 rounded"></div>
                    <div className="h-2 bg-slate-500/10 w-9/12 rounded"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-4">
                    <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg">
                      <div className="w-12 h-2 bg-slate-600/35 rounded mb-2"></div>
                      <div className="w-full h-2.5 bg-indigo-500/10 rounded"></div>
                    </div>
                    <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg">
                      <div className="w-16 h-2 bg-slate-600/35 rounded mb-2"></div>
                      <div className="w-full h-2.5 bg-indigo-500/10 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 px-6 border-b border-white/5 relative">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Built-in Capabilities</h2>
            <h3 className="text-3xl font-sans font-bold text-white tracking-tight">The ultimate toolset for modern organizations.</h3>
            <p className="text-xs text-slate-400">Everything needed to turn unstructured verbal communications into standard structured outcomes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {features.map((feat, idx) => (
              <div 
                key={idx} 
                className="bg-[#121214] border border-white/5 rounded-2xl p-6 hover:border-white/10 hover:bg-white/[0.01] transition duration-200 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center">
                    {feat.icon}
                  </div>
                  <h4 className="font-sans font-semibold text-white text-base">{feat.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans font-medium">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-20 px-6 border-b border-white/5 bg-gradient-to-b from-[#08080A] to-[#0A0A0E] relative">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-xs font-bold text-sky-400 uppercase tracking-widest">Workflow Loops</h2>
            <h3 className="text-3xl font-sans font-bold text-white tracking-tight">How automated synthesis pipeline operates.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 relative">
            {/* Step 1 */}
            <div className="space-y-4 relative">
              <span className="text-6xl font-mono font-bold text-indigo-500/10 absolute -top-10 -left-2 select-none">01</span>
              <div className="p-5 bg-[#121214] border border-white/5 rounded-2xl space-y-2 relative z-10">
                <h4 className="font-semibold text-white text-sm">Input Dialogue</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed font-sans">
                  Speak into browser mic, capture active browser tab audio streams, or paste transcripts straight into the engine.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-4 relative">
              <span className="text-6xl font-mono font-bold text-sky-500/10 absolute -top-10 -left-2 select-none">02</span>
              <div className="p-5 bg-[#121214] border border-white/5 rounded-2xl space-y-2 relative z-10">
                <h4 className="font-semibold text-white text-sm">Gemini AI Synthesis</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed font-sans">
                  The LLM engine transcribes waves, separates distinct speaker entities, and aligns tasks relative to target schedules.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 relative">
              <span className="text-6xl font-mono font-bold text-emerald-500/10 absolute -top-10 -left-2 select-none">03</span>
              <div className="p-5 bg-[#121214] border border-white/5 rounded-2xl space-y-2 relative z-10">
                <h4 className="font-semibold text-white text-sm">Coordinated Actioning</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed font-sans">
                  Visualize tasks in interactive boards, view completion ratios, schedule Google Meet calls, and export official MOM documents.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-xs font-bold text-pink-400 uppercase tracking-widest">Global Reviews</h2>
            <h3 className="text-3xl font-sans font-bold text-white tracking-tight">Loved by high-velocity corporate makers.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {testimonials.map((test, idx) => (
              <div key={idx} className="bg-[#121214] border border-white/5 p-6 rounded-2xl relative flex flex-col justify-between">
                <p className="text-xs text-slate-300 italic leading-relaxed font-sans mb-6">"{test.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {test.avatar}
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-white">{test.author}</span>
                    <span className="block text-[10px] text-slate-500 font-medium">{test.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing cards */}
      <section id="pricing" className="py-20 px-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-xs font-bold text-amber-400 uppercase tracking-widest">SaaS Pricing</h2>
            <h3 className="text-3xl font-sans font-bold text-white tracking-tight">Flexible plans scaled for high-frequency teams.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            {pricingPlans.map((plan, idx) => (
              <div 
                key={idx} 
                className={`bg-[#121214] rounded-3xl border p-8 flex flex-col justify-between relative overflow-hidden ${
                  plan.isPopular 
                    ? 'border-indigo-600 ring-2 ring-indigo-600/10 shadow-xl shadow-indigo-600/5' 
                    : 'border-white/5'
                }`}
              >
                {plan.isPopular && (
                  <span className="absolute -right-12 top-6 bg-indigo-600 text-white text-[9px] font-bold uppercase tracking-widest px-12 py-1 rotate-45">
                    Popular
                  </span>
                )}
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-base font-bold text-white">{plan.name}</h4>
                    <p className="text-xs text-slate-500 mt-1">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline text-white">
                    <span className="text-4xl font-black font-sans tracking-tight">{plan.price}</span>
                    {plan.period && <span className="text-slate-400 text-xs ml-1 font-semibold">{plan.period}</span>}
                  </div>

                  <hr className="border-white/5" />

                  <ul className="space-y-3.5 text-xs text-slate-300 font-medium">
                    {plan.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <button 
                    onClick={onEnterApp}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      plan.isPopular
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/15'
                        : 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/5'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Anchor Section */}
      <section className="py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-3xl mx-auto relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-sans font-bold text-white tracking-tight leading-tight">
            Stop losing critical alignments today.
          </h2>
          <p className="text-base text-slate-400 max-w-lg mx-auto leading-relaxed">
            Record, synthesize, task, and drive action automatically using Gemini administrative intelligence. 
          </p>
          <div>
            <button
              onClick={onEnterApp}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3.5 rounded-xl transition text-sm shadow-xl shadow-indigo-600/25 cursor-pointer"
            >
              <span>Get Started Instantly (No card needed)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050507] border-t border-white/5 py-12 px-6 text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="font-sans font-bold text-white text-sm tracking-tight">AI Meeting Assistant</span>
          </div>

          <p className="text-center font-sans">
            © 2026 AI CRM & Meeting Notes Sync Inc. Powered by Google Workspace cloud schemas.
          </p>

          <div className="flex gap-4 font-semibold text-[11px]">
            <span className="hover:text-white transition cursor-pointer">Security API</span>
            <span className="hover:text-white transition cursor-pointer">Terms of Service</span>
            <span className="hover:text-white transition cursor-pointer">Privacy Charter</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
