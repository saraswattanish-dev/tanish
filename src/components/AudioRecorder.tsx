import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  Upload, 
  Play, 
  Square, 
  Loader2, 
  Sparkles, 
  AlertCircle, 
  FileText, 
  Chrome,
  CheckCircle2,
  Video
} from 'lucide-react';

interface AudioRecorderProps {
  onProcessTranscript: (transcript: string, meetingTitle: string) => Promise<void>;
  isProcessing: boolean;
  samples: Array<{ id: string; title: string; transcript: string }>;
  onProcessingStatusChange?: (isProcessing: boolean, statusText?: string, tempTitle?: string) => void;
}

export default function AudioRecorder({ 
  onProcessTranscript, 
  isProcessing, 
  samples,
  onProcessingStatusChange
}: AudioRecorderProps) {
  const [activeTab, setActiveTab] = useState<'record' | 'upload' | 'sample' | 'paste'>('record');
  const [recordMode, setRecordMode] = useState<'mic' | 'tab'>('mic');
  
  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  // File states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Paste states
  const [pasteTitle, setPasteTitle] = useState('');
  const [pasteContent, setPasteContent] = useState('');

  // Status logs
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Refs for recorder
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const activeStreamRef = useRef<MediaStream | null>(null);

  // Handle timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Start recording (Mic or Tab Audio!)
  const startRecording = async () => {
    audioChunksRef.current = [];
    setErrorMsg(null);
    setAudioUrl(null);
    setAudioBlob(null);

    try {
      let stream: MediaStream;

      if (recordMode === 'tab') {
        setStatusMsg("Initializing Browser Display Capture loopback...");
        // Captures system display sound
        const displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: true, // required by browsers
          audio: true  // requested tab loopback sound
        });

        // Verify that the user actually ticked "Share tab audio"
        const audioTracks = displayStream.getAudioTracks();
        if (audioTracks.length === 0) {
          // Stop remaining video tracks representing shared tab/screen
          displayStream.getTracks().forEach(t => t.stop());
          throw new Error("No browser audio track shared. You MUST check the 'Share tab audio' checkbox before sharing display.");
        }

        // We only record the audio track stream
        stream = new MediaStream(audioTracks);
        // Also keep a reference to stop video frames shared in background
        activeStreamRef.current = displayStream;
      } else {
        // Standard user microphone stream
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        activeStreamRef.current = stream;
      }

      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        // Stop all track streams so permission indicators turn off
        if (activeStreamRef.current) {
          activeStreamRef.current.getTracks().forEach((track) => track.stop());
        }
      };

      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      setStatusMsg(recordMode === 'tab' ? "Recording Browser tab audio active... speak or play audio." : "Recording microphone active... speak naturally.");
    } catch (err: any) {
      console.error(err);
      const isPolicyDisallowed = err.message && (
        err.message.includes('display-capture') || 
        err.message.includes('getDisplayMedia') || 
        err.message.includes('Permissions policy') ||
        err.name === 'SecurityError' ||
        (err.name === 'NotAllowedError' && recordMode === 'tab')
      );

      if (isPolicyDisallowed) {
        setErrorMsg("IFRAME_DISPLAY_CAPTURE_DISALLOWED");
      } else if (err.message && (err.message.includes('No browser audio track shared') || err.message.includes('Share tab audio'))) {
        setErrorMsg("NO_TAB_AUDIO_SHARED_ERROR");
      } else {
        setErrorMsg(err.message || "Recording access denied. Check microphone authorizations.");
      }
      setStatusMsg(null);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setStatusMsg("Recording completed successfully. Click 'Analyze Meeting Input' below to process.");
    }
  };

  // Drag operations
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setErrorMsg(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('audio/')) {
        setSelectedFile(file);
        setStatusMsg(`Selected file: ${file.name}`);
      } else {
        setErrorMsg("Unaccepted file format. Please drop a valid audio file (MP3, WAV, WEBM).");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setStatusMsg(`Selected file: ${file.name}`);
    }
  };

  // Base64 helper
  const convertBlobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.readAsDataURL(blob);
    });
  };

  // Helper to inform parent App state in real-time
  const updateStatus = (msg: string | null, isProc = true) => {
    setStatusMsg(msg);
    if (onProcessingStatusChange) {
      const getTitle = () => {
        if (activeTab === 'record') {
          return recordMode === 'tab' ? "System Tab Loopback Sync" : "Microphone Audio Recording";
        } else if (activeTab === 'upload') {
          return selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, "") : "Audio File Import";
        } else {
          return pasteTitle.trim() || "Manual Notes Alignment";
        }
      };
      onProcessingStatusChange(isProc, msg || '', getTitle());
    }
  };

  // Synthesize pipeline
  const handleProcess = async () => {
    setErrorMsg(null);
    updateStatus("Initializing AI synthesis pipeline...", true);

    try {
      if (activeTab === 'record') {
        if (!audioBlob) {
          setErrorMsg("No recording captured. Please click start, record sound, then click stop first.");
          updateStatus(null, false);
          return;
        }

        updateStatus("Transcribing vocal wave contents (Calling server-side Gemini)...", true);
        const base64Audio = await convertBlobToBase64(audioBlob);
        
        const response = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audio: base64Audio, mimeType: 'audio/webm' })
        });

        const resData = await response.json();
        if (!resData.success) {
          throw new Error(resData.error || "Fails to transcribe audio.");
        }

        updateStatus("Analyzing transcript & writing Minutes of Meeting (MOM)...", true);
        await onProcessTranscript(
          resData.transcript, 
          recordMode === 'tab' ? "System Tab Loopback Sync" : "Microphone Audio Recording"
        );
        updateStatus("MOM structured perfectly!", false);
      }

      else if (activeTab === 'upload') {
        if (!selectedFile) {
          setErrorMsg("Please select or drop an audio file first.");
          updateStatus(null, false);
          return;
        }

        updateStatus("Reading audio file bytes...", true);
        const base64Audio = await convertBlobToBase64(selectedFile);
        
        updateStatus("Transcribing wave parameters (Calling server-side Gemini)...", true);
        const response = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audio: base64Audio, mimeType: selectedFile.type })
        });

        const resData = await response.json();
        if (!resData.success) {
          throw new Error(resData.error || "Fails to transcribe custom file.");
        }

        updateStatus("Analyzing transcript & writing Minutes of Meeting (MOM)...", true);
        await onProcessTranscript(resData.transcript, selectedFile.name.replace(/\.[^/.]+$/, ""));
        updateStatus("Meeting synthesized perfectly!", false);
      }

      else if (activeTab === 'paste') {
        if (!pasteContent.trim()) {
          setErrorMsg("Please paste some dialogues or shorthand script nodes.");
          updateStatus(null, false);
          return;
        }
        
        updateStatus("Extracting decision markers and actionable tasks...", true);
        await onProcessTranscript(pasteContent, pasteTitle.trim() || "Manual Alignment Note Sync");
        updateStatus("Minutes of Meeting updated!", false);
      }

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred in the analysis workflow.");
      updateStatus(null, false);
    }
  };

  return (
    <div id="capture-source-hub" className="bg-[#121214] rounded-3xl border border-white/5 p-6 shadow-sm overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-white/5 mb-6 gap-2">
        <button
          onClick={() => { setActiveTab('record'); setErrorMsg(null); setStatusMsg(null); }}
          className={`flex items-center gap-2 pb-3 px-3 border-b-2 text-sm font-medium transition cursor-pointer ${
            activeTab === 'record'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>Record Live</span>
        </button>

        <button
          onClick={() => { setActiveTab('upload'); setErrorMsg(null); setStatusMsg(null); }}
          className={`flex items-center gap-2 pb-3 px-3 border-b-2 text-sm font-medium transition cursor-pointer ${
            activeTab === 'upload'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Upload File</span>
        </button>

        <button
          onClick={() => { setActiveTab('paste'); setErrorMsg(null); setStatusMsg(null); }}
          className={`flex items-center gap-2 pb-3 px-3 border-b-2 text-sm font-medium transition cursor-pointer ${
            activeTab === 'paste'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Paste Notes</span>
        </button>
      </div>

      {/* Recording Pane with Submode choices */}
      {activeTab === 'record' && (
        <div className="flex flex-col items-center justify-center py-4 space-y-5">
          {/* Record Options choice */}
          {!isRecording && (
            <div className="flex bg-white/[0.02] border border-white/5 p-1 rounded-xl gap-1">
              <button
                onClick={() => setRecordMode('mic')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  recordMode === 'mic' 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>My Mic</span>
              </button>
              
              <button
                onClick={() => setRecordMode('tab')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  recordMode === 'tab' 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Otter.ai style browser loopback. Captures display or tab audio."
              >
                <Chrome className="w-3.5 h-3.5" />
                <span>Share Tab Audio</span>
              </button>
            </div>
          )}

          {/* Core Recording Trigger */}
          <div className="relative">
            {isRecording && (
              <span className="absolute -inset-2 rounded-full bg-rose-500/20 animate-ping opacity-75"></span>
            )}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
              className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition shadow-lg cursor-pointer ${
                isRecording
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
              }`}
            >
              {isRecording ? <Square className="w-6 h-6 fill-white" /> : <Mic className="w-6 h-6" />}
            </button>
          </div>

          <div className="text-center">
            <p className="text-2xl font-mono font-bold text-white tracking-wide">{formatTime(recordingSeconds)}</p>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">
              {isRecording 
                ? (recordMode === 'tab' ? "Capturing active browser loopback..." : "Recording mic stream input...") 
                : `Click to start ${recordMode === 'tab' ? 'Otter loopback' : 'microphone'} session`}
            </p>
          </div>

          {/* Dynamic Audio wave simulation */}
          {isRecording && (
            <div className="flex gap-1 h-8 items-center pt-2">
              {[0.4, 0.9, 0.3, 0.7, 0.5, 0.8, 0.1, 0.6, 0.85, 0.4, 0.7, 0.2, 0.5, 0.9, 0.3].map((v, i) => (
                <div
                  key={i}
                  className="w-1 bg-indigo-500 rounded-full animate-pulse"
                  style={{
                    height: `${v * 100}%`,
                    animationDelay: `${i * 0.08}s`,
                    animationDuration: '0.5s'
                  }}
                ></div>
              ))}
            </div>
          )}

          {/* Saved notification preview */}
          {audioUrl && !isRecording && (
            <div className="w-full max-w-sm bg-white/[0.03] p-3 rounded-xl border border-white/5 flex items-center gap-3 justify-between">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-[10px] text-slate-400 font-semibold font-mono">Captured WAV blob</span>
              </div>
              <audio src={audioUrl} controls className="w-40 h-8 invert opacity-50" />
            </div>
          )}
        </div>
      )}

      {/* File Drop Drag Box */}
      {activeTab === 'upload' && (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-loader')?.click()}
          className={`border-2 border-dashed rounded-2xl py-8 px-6 text-center cursor-pointer transition ${
            dragActive
              ? 'border-indigo-500 bg-indigo-500/5'
              : 'border-white/10 hover:border-white/20 hover:bg-white/[0.01]'
          }`}
        >
          <input
            id="file-loader"
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="p-3 bg-white/5 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Upload className="w-6 h-6" />
          </div>
          <p className="font-sans font-medium text-slate-200 text-sm">
            {selectedFile ? selectedFile.name : "Drag & Drop meeting wave file here"}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Supports MP3, WAV, M4A, WEBM audio format waves (up to 30MB)
          </p>
          {selectedFile && (
            <span className="inline-block mt-3 px-2.5 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-semibold rounded-md border border-indigo-500/20">
              Change Audio Source
            </span>
          )}
        </div>
      )}

      {/* Clipboard typing paste pad */}
      {activeTab === 'paste' && (
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
              Meeting Context Title
            </label>
            <input
              type="text"
              placeholder="e.g. Q3 Strategic Alignment"
              value={pasteTitle}
              onChange={(e) => setPasteTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-xs text-slate-100 placeholder-slate-600"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
              Raw Transcript Dialogues or Notes
            </label>
            <textarea
              rows={5}
              placeholder="Sarah Wayne: We need Frank to publish migrations by Wednesday.&#10;Frank: I will get right on that."
              value={pasteContent}
              onChange={(e) => setPasteContent(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-xs text-slate-100 placeholder-slate-600 font-sans leading-relaxed"
            ></textarea>
          </div>
        </div>
      )}

      {/* Warning display log */}
      {errorMsg === "IFRAME_DISPLAY_CAPTURE_DISALLOWED" ? (
        <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-3 text-amber-200 text-xs leading-relaxed animate-in fade-in duration-200">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
            <div>
              <strong className="text-white block font-sans font-bold text-sm">Security Sandbox Protection Active</strong>
              <span>Browsers block inline display-capture (tab audio recording) when the application is rendered inside a developer preview workspace frame.</span>
            </div>
          </div>
          
          <div className="bg-indigo-950/20 p-3 rounded-xl border border-indigo-500/10 space-y-2">
            <p className="font-semibold text-indigo-300 text-[11px] uppercase tracking-wider">How to record Tab Audio:</p>
            <ol className="list-decimal pl-4 text-slate-300 space-y-1 text-[11px] font-medium">
              <li>Look at the top-right corner of your AI Studio preview pane.</li>
              <li>Click the <span className="font-bold text-white">"Open in a new tab"</span> shortcut button.</li>
              <li>Once open in its own direct browser tab, you can click <span className="font-bold text-white">"Share Tab Audio"</span> and securely select any tab or video feed!</li>
            </ol>
          </div>

          <div className="text-[10px] text-slate-400 flex items-center justify-between border-t border-white/5 pt-2.5">
            <span>Or capture using your default device microphone instead.</span>
            <button
              type="button"
              onClick={() => {
                setRecordMode('mic');
                setErrorMsg(null);
              }}
              className="text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wider text-[10px] cursor-pointer animate-pulse"
            >
              Switch to Mic Mode
            </button>
          </div>
        </div>
      ) : errorMsg === "NO_TAB_AUDIO_SHARED_ERROR" ? (
        <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-3.5 text-amber-200 text-xs leading-relaxed animate-in fade-in duration-200">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
            <div>
              <strong className="text-white block font-sans font-bold text-sm">Enable "Share tab audio" Checkbox</strong>
              <span>Chrome requiring explicit permission prevents applications from receiving browser sound streams unless manually checked on share.</span>
            </div>
          </div>

          {/* Step by Step Visual Diagram Wrapper */}
          <div className="bg-indigo-950/20 p-3.5 rounded-xl border border-indigo-500/10 space-y-3">
            <p className="font-bold text-indigo-300 text-[11px] uppercase tracking-wider">Quick Action Steps:</p>
            <ol className="list-decimal pl-4 text-slate-300 space-y-1 text-[11px] font-semibold">
              <li>Click the <strong className="text-white font-sans">"Restart Capture"</strong> action button below.</li>
              <li>Look at the <strong className="text-white">bottom-left corner</strong> of the choose menu.</li>
              <li>Check the label marked <span className="text-[#EAB308] font-black">"Also share tab audio"</span> (or "Share tab audio") and authorize!</li>
            </ol>

            <div className="bg-black/40 border border-white/5 rounded-xl p-3 my-2 space-y-2">
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono font-bold">Dialog Guide Overlay:</p>
              <div className="relative border border-slate-700/50 rounded-lg p-3 bg-slate-900/40 text-[10px] text-slate-400 space-y-2 font-sans select-none">
                {/* Window Header */}
                <div className="flex items-center gap-1 border-b border-white/5 pb-1.5 opacity-50">
                  <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <span className="ml-1 text-[8px] font-mono tracking-tight text-slate-500">Choose what to share...</span>
                </div>
                {/* Selection representation */}
                <div className="grid grid-cols-2 gap-2 py-1 opacity-70">
                  <div className="border border-indigo-500/30 bg-indigo-500/5 rounded p-1.5 flex flex-col items-center justify-center h-12 text-center text-[8px]">
                    <Chrome className="w-3.5 h-3.5 mb-1 text-slate-500" />
                    <span>Meeting Tab</span>
                  </div>
                  <div className="border border-white/5 bg-white/[0.01] rounded p-1.5 flex flex-col items-center justify-center h-12 text-center text-[8px] opacity-40">
                    <Video className="w-3.5 h-3.5 mb-1" />
                    <span>Entire Screen</span>
                  </div>
                </div>
                {/* Bottom bar with checkbox */}
                <div className="flex items-center justify-between border-t border-white/5 pt-1.5">
                  <div className="flex items-center gap-1 text-amber-300 font-semibold animate-pulse">
                    <span className="w-3.5 h-3.5 border-2 border-amber-400 rounded bg-amber-400/20 flex items-center justify-center text-amber-300 text-[10px] font-mono font-bold">✓</span>
                    <span className="text-[9px] text-amber-200 font-sans font-bold">Also share tab audio</span>
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                  </div>
                  <div className="flex gap-1.5 opacity-60">
                    <span className="px-2 py-0.5 bg-white/5 rounded text-[8px]">Cancel</span>
                    <span className="px-2 py-0.5 bg-indigo-600 rounded text-[8px] font-semibold text-white">Share</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 flex items-center justify-between border-t border-white/5 pt-2.5">
            <span>Ready to retry loopback?</span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  startRecording();
                }}
                className="text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wider text-[10px] cursor-pointer"
              >
                Restart Capture
              </button>
              <button
                type="button"
                onClick={() => {
                  setRecordMode('mic');
                  setErrorMsg(null);
                }}
                className="text-slate-500 hover:text-slate-400 font-bold uppercase tracking-wider text-[10px] cursor-pointer"
              >
                Use Mic Instead
              </button>
            </div>
          </div>
        </div>
      ) : errorMsg && (
        <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/15 rounded-xl flex gap-1.5 text-rose-400 text-[11px] font-medium leading-relaxed">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      {/* Operation Status Log */}
      {statusMsg && (
        <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/15 rounded-xl flex gap-1.5 text-indigo-400 text-[11px] font-semibold tracking-wide items-center">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400 shrink-0" />
          <p>{statusMsg}</p>
        </div>
      )}

      {/* Executer trigger button */}
      {activeTab !== 'sample' && (
        <button
          onClick={handleProcess}
          disabled={isProcessing || isRecording}
          className="w-full mt-5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/5 disabled:text-slate-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/15"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing with Gemini AI models...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-white" />
              <span>Synthesize Dialogue Outcomes</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
