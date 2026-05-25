import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  ArrowUpRight, 
  CheckCircle2, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Printer, 
  Download,
  Trash
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Meeting } from '../types';

interface MeetingDetailsProps {
  meeting: Meeting;
  onDeleteMeeting?: (id: string, e: React.MouseEvent) => void;
}

export default function MeetingDetails({ meeting, onDeleteMeeting }: MeetingDetailsProps) {
  const [showTranscript, setShowTranscript] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  if (!meeting) return null;

  const participantsColors = [
    'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    'bg-sky-500/10 text-sky-400 border border-sky-500/20',
    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    'bg-pink-500/10 text-pink-400 border border-pink-500/20',
    'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    'bg-purple-500/10 text-purple-400 border border-purple-500/20'
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const filteredTranscriptLines = meeting.transcript
    ? meeting.transcript.split('\n').filter(line => 
        line.toLowerCase().includes(filterQuery.toLowerCase())
      )
    : [];

  // Export MOM details as clean, beautiful formatted MS Word Document (.doc)
  const handleExportMarkdown = () => {
    try {
      const pList = meeting.participants?.map(p => `<li><strong>${p.name}</strong> - <em>${p.role || 'Attendee'}</em></li>`).join('\n') || '';
      const decList = meeting.summary?.decisions?.map((d, i) => `
        <div style="margin-bottom: 12px; padding: 12px; background-color: #f0fdfa; border-left: 4px solid #10b981; border-radius: 6px;">
          <h4 style="margin: 0; color: #047857; font-size: 13px;">DECISION #${i + 1} (Proposed by: ${d.who})</h4>
          <p style="margin: 5px 0 0 0; font-weight: bold; font-size: 13px; color: #1f2937;">${d.decision}</p>
          ${d.context ? `<p style="margin: 4px 0 0 0; font-style: italic; font-size: 11px; color: #4b5563;"><strong>Context:</strong> ${d.context}</p>` : ''}
        </div>
      `).join('\n') || '';
      const tList = meeting.tasks?.map((t, i) => `<li><strong>[${t.priority.toUpperCase()}] ${t.title}</strong> - Assigned to ${t.assignedTo} (Due Date: ${t.dueDate || 'N/A'})</li>`).join('\n') || '';
      const highlightList = meeting.summary?.highlights?.map(h => `<li>${h}</li>`).join('\n') || '';

      const content = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <title>Minutes of Meeting</title>
          <!--[if gte mso 9]>
          <xml>
            <w:WordDocument>
              <w:View>Print</w:View>
              <w:Zoom>100</w:Zoom>
              <w:DoNotOptimizeForBrowser/>
            </w:WordDocument>
          </xml>
          <![endif]-->
          <style>
            body { font-family: 'Helvetica', 'Arial', sans-serif; line-height: 1.6; color: #333333; padding: 40px; }
            h1 { color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; font-size: 24px; font-weight: bold; }
            h2 { color: #312e81; font-size: 16px; margin-top: 25px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; font-weight: bold; }
            .meta-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            .meta-table td { padding: 8px; border: 1px solid #e2e8f0; font-size: 13px; }
            .meta-label { font-weight: bold; background-color: #f8fafc; color: #475569; width: 30%; }
            ul, ol { padding-left: 20px; font-size: 13px; color: #374151; }
            li { margin-bottom: 6px; }
            .footer { margin-top: 40px; font-size: 11px; color: #94a3b8; border-top: 1px dashed #e2e8f0; padding-top: 10px; }
          </style>
        </head>
        <body>
          <h1>MINUTES OF MEETING (MOM)</h1>
          <div style="font-size: 11px; font-weight: bold; color: #4f46e5; text-transform: uppercase; letter-spacing: 1px;">AI-Synthesised Administrative Work Record</div>
          
          <table class="meta-table">
            <tr>
              <td class="meta-label">MOM TITLE</td>
              <td style="font-weight: bold; font-size: 14px;">${meeting.title}</td>
            </tr>
            <tr>
              <td class="meta-label">DATE</td>
              <td>${meeting.date}</td>
            </tr>
            <tr>
              <td class="meta-label">DURATION</td>
              <td>${meeting.duration || 'N/A'}</td>
            </tr>
            <tr>
              <td class="meta-label">REFERENCE REFRESH ID</td>
              <td style="font-family: monospace;">#${meeting.id}</td>
            </tr>
          </table>

          <h2>1. ATTENDING PARTICIPANTS</h2>
          <ul>
            ${pList || '<li>No attendees registered.</li>'}
          </ul>

          <h2>2. SESSION MOTIVATION / EXECUTIVE AGENDA SUMMARY</h2>
          <p style="font-size: 13px; color: #374151; background-color: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0;">
            ${meeting.summary?.agenda || 'No executive narrative summary recorded.'}
          </p>

          <h2>3. KEY DISCUSSION HIGHLIGHTS</h2>
          <ul>
            ${highlightList || '<li>No specific items noted.</li>'}
          </ul>

          <h2>4. STRATEGIC DECISIONS SETTLED</h2>
          ${decList || '<p style="font-size: 12px; color: #6b7280; font-style: italic;">No core team decisions logged during this call.</p>'}

          <h2>5. RECONCILED TASK DELIVERABLES / ACTIONS</h2>
          <ol>
            ${tList || '<li>No active action items assigned.</li>'}
          </ol>

          <div class="footer">
            Generated with MeetSync Core SaaS Integration Workspace on ${new Date().toLocaleDateString()}. Code compliance.
          </div>
        </body>
        </html>
      `;

      const blob = new Blob(['\ufeff' + content], { type: 'application/msword;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `MOM-${meeting.title.toLowerCase().replace(/\s+/g, '-')}.doc`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert("Error generating MOM document.");
    }
  };

  // Triggers professional client-side generation and direct PDF download via jsPDF
  const handlePrintMOM = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);

      let y = 25;

      const drawHeader = (pageNumber: number) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184); // light gray
        doc.text(`AI-SYNTHESISED CORPORATE MINUTES OF MEETING (MOM)`, margin, 12);
        doc.text(`CONFIDENTIAL RECORD`, pageWidth - margin - 35, 12);
        doc.setDrawColor(226, 232, 240); // very light boundary line
        doc.setLineWidth(0.2);
        doc.line(margin, 15, pageWidth - margin, 15);
      };

      const drawFooter = (pageNumber: number) => {
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.2);
        doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(`MOM Ref ID: #${meeting.id} | Generated: ${new Date().toLocaleDateString()}`, margin, pageHeight - 10);
        doc.text(`Page ${pageNumber}`, pageWidth - margin - 15, pageHeight - 10);
      };

      let pageCount = 1;
      drawHeader(pageCount);
      drawFooter(pageCount);

      const checkPageBreak = (heightNeeded: number) => {
        if (y + heightNeeded > pageHeight - 20) {
          doc.addPage();
          pageCount++;
          y = 25;
          drawHeader(pageCount);
          drawFooter(pageCount);
        }
      };

      // Header title block
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(17, 24, 39); // deep slate/black
      doc.text("MINUTES OF MEETING (MOM)", margin, y);
      y += 10;

      // Draw beautiful active colored marker border
      doc.setFillColor(79, 70, 229); // Beautiful Indigo
      doc.rect(margin, y, 15, 3, 'F');
      y += 8;

      // Meeting title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(31, 41, 55);
      
      const wrappedTitle = doc.splitTextToSize(meeting.title, contentWidth);
      checkPageBreak(wrappedTitle.length * 6);
      wrappedTitle.forEach((line: string) => {
        doc.text(line, margin, y);
        y += 6;
      });
      y += 4;

      // Key details grid list
      const details = [
        { label: "MOM Identifier:", val: `#${meeting.id}` },
        { label: "Session Date:", val: meeting.date },
        { label: "Duration length:", val: meeting.duration || "N/A" }
      ];

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      details.forEach(item => {
        checkPageBreak(7);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(71, 85, 105);
        doc.text(item.label, margin, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
        doc.text(item.val, margin + 40, y);
        y += 6;
      });

      y += 6;

      // 1. Participants List
      checkPageBreak(15);
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(79, 70, 229); // Indigo
      doc.text("1. MEETING PARTICIPANTS", margin, y);
      y += 8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);

      if (meeting.participants && meeting.participants.length > 0) {
        meeting.participants.forEach((p, idx) => {
          checkPageBreak(7);
          doc.setFont('helvetica', 'bold');
          doc.text(`- ${p.name}`, margin + 5, y);
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(100, 116, 139);
          doc.text(`(${p.role || 'Attendee'})`, margin + 65, y);
          doc.setTextColor(51, 65, 85);
          y += 6;
        });
      } else {
        checkPageBreak(7);
        doc.text("- No registered participants reported.", margin + 5, y);
        y += 6;
      }
      y += 4;

      // 2. Executive Agenda Summaries
      checkPageBreak(15);
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(79, 70, 229);
      doc.text("2. EXECUTIVE CORE AGENDA SUMMARY", margin, y);
      y += 8;

      const agendaText = meeting.summary?.agenda || "No core summary recorded.";
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);

      const wrappedAgenda = doc.splitTextToSize(agendaText, contentWidth - 10);
      wrappedAgenda.forEach((line: string) => {
        checkPageBreak(6);
        doc.text(line, margin + 5, y);
        y += 6;
      });
      y += 4;

      // 3. Key Discussion Highlights & Minutes
      checkPageBreak(15);
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(79, 70, 229);
      doc.text("3. DISCUSSION DIALOGUES & HIGHLIGHTS", margin, y);
      y += 8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);

      if (meeting.summary?.highlights && meeting.summary.highlights.length > 0) {
        meeting.summary.highlights.forEach((bullet, idx) => {
          const bulletText = `${idx + 1}. ${bullet}`;
          const wrappedBullet = doc.splitTextToSize(bulletText, contentWidth - 10);
          checkPageBreak(wrappedBullet.length * 6 + 2);
          wrappedBullet.forEach((line: string) => {
            doc.text(line, margin + 5, y);
            y += 6;
          });
          y += 2;
        });
      } else {
        checkPageBreak(7);
        doc.text("- No discussion highlights captured.", margin + 5, y);
        y += 6;
      }
      y += 4;

      // 4. Strategic Decisions Settled
      checkPageBreak(15);
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(79, 70, 229);
      doc.text("4. FORMAL DECISIONS CONCLUDED", margin, y);
      y += 8;

      if (meeting.summary?.decisions && meeting.summary.decisions.length > 0) {
        meeting.summary.decisions.forEach((dec, idx) => {
          const decisionHeader = `DECISION #${idx + 1} (Captured By: ${dec.who})`;
          const decisionBody = `Decision: ${dec.decision}`;
          const decContext = dec.context ? `Context: ${dec.context}` : '';

          const wrappedHeader = doc.splitTextToSize(decisionHeader, contentWidth - 10);
          const wrappedBody = doc.splitTextToSize(decisionBody, contentWidth - 15);
          const wrappedCtrl = decContext ? doc.splitTextToSize(decContext, contentWidth - 15) : [];

          const blockHeight = (wrappedHeader.length + wrappedBody.length + wrappedCtrl.length) * 5.5 + 8;
          checkPageBreak(blockHeight);

          // Draw a small subtle background rect for decision box
          doc.setFillColor(240, 253, 250); // very light emerald bg
          doc.rect(margin + 2, y, contentWidth - 4, blockHeight - 4, 'F');

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(5, 150, 105); // emerald color
          wrappedHeader.forEach((line: string) => {
            doc.text(line, margin + 8, y + 5);
            y += 5;
          });
          y += 2;

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9.5);
          doc.setTextColor(31, 41, 55);
          wrappedBody.forEach((line: string) => {
            doc.text(line, margin + 12, y + 4);
            y += 5;
          });

          if (decContext) {
            y += 2;
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(8.5);
            doc.setTextColor(75, 85, 99);
            wrappedCtrl.forEach((line: string) => {
              doc.text(line, margin + 12, y + 4);
              y += 5;
            });
          }

          y += 6;
        });
      } else {
        checkPageBreak(7);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(51, 65, 85);
        doc.text("- No formal strategic decisions logged.", margin + 5, y);
        y += 6;
      }
      y += 4;

      // 5. Reconciled Deliverable Tasks
      checkPageBreak(15);
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(79, 70, 229);
      doc.text("5. RECONCILED ACTION DELIVERABLES", margin, y);
      y += 8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);

      if (meeting.tasks && meeting.tasks.length > 0) {
        meeting.tasks.forEach((t, idx) => {
          const taskLine = `${idx + 1}. [${t.priority.toUpperCase()}] ${t.title}`;
          const assignLine = `   Assigned to: ${t.assignedTo} | Due: ${t.dueDate || 'N/A'}`;
          const wrappedTask = doc.splitTextToSize(taskLine, contentWidth - 10);
          const wrappedAssign = doc.splitTextToSize(assignLine, contentWidth - 15);

          checkPageBreak(wrappedTask.length * 6 + wrappedAssign.length * 5 + 4);

          doc.setFont('helvetica', 'bold');
          wrappedTask.forEach((line: string) => {
            doc.text(line, margin + 5, y);
            y += 6;
          });

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(100, 116, 139);
          wrappedAssign.forEach((line: string) => {
            doc.text(line, margin + 5, y);
            y += 5;
          });
          doc.setFontSize(10);
          doc.setTextColor(51, 65, 85);
          y += 2;
        });
      } else {
        checkPageBreak(7);
        doc.text("- No active action items registered.", margin + 5, y);
        y += 6;
      }

      doc.save(`MOM-${meeting.title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Error generating corporate PDF document asset.");
    }
  };

  return (
    <div id="meeting-details-view" className="bg-[#121214] rounded-3xl border border-white/5 p-6 shadow-sm space-y-6 print:p-8 print:border-none print:shadow-none print:bg-white print:text-slate-950">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-white/5 pb-5 print:border-slate-300">
        <div>
          <div className="flex items-center gap-2 mb-2 print:hidden">
            <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase rounded-md tracking-wider flex items-center gap-1 border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Processed MOM</span>
            </span>
            <span className="text-xs text-slate-500 font-mono font-medium">#{meeting.id}</span>
          </div>
          <h2 className="font-sans font-bold text-white text-xl tracking-tight leading-snug print:text-black print:text-2xl">
            {meeting.title}
          </h2>
          
          <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-400 font-medium print:text-slate-600">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500 print:text-black" />
              <span>Date: {meeting.date}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500 print:text-black" />
              <span>Length: {meeting.duration || 'N/A'}</span>
            </span>
          </div>
        </div>

        {/* Export / Print Triggers */}
        <div className="flex flex-wrap items-center gap-2 print:hidden shrink-0 self-end md:self-start">
          <button
            onClick={handlePrintMOM}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold rounded-xl transition border border-white/5 cursor-pointer"
            title="Download formatted corporate PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
          
          <button
            onClick={handleExportMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-lg shadow-indigo-600/10"
            title="Export raw markdown"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export MOM</span>
          </button>

          {onDeleteMeeting && (
            <button
              onClick={(e) => onDeleteMeeting(meeting.id, e)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white hover:border-transparent text-xs font-bold rounded-xl transition border border-rose-500/20 cursor-pointer shadow-md select-none"
              title="Delete this meeting record permanently"
            >
              <Trash className="w-3.5 h-3.5" />
              <span>Delete Record</span>
            </button>
          )}
        </div>

        {/* Print indicator header */}
        <div className="hidden print:block">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-900 rounded-full text-xs font-bold border border-slate-300">
            <span>OFFICIAL MOM RECORD</span>
          </span>
        </div>
      </div>

      {/* Participants Hub */}
      <div className="space-y-2">
        <h4 className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wide print:text-slate-700">
          <Users className="w-4 h-4 text-slate-500 print:text-black" />
          <span>Participants ({meeting.participants ? meeting.participants.length : 0})</span>
        </h4>
        <div className="flex flex-wrap gap-3 pt-1">
          {meeting.participants && meeting.participants.map((person, index) => (
            <div 
              key={index} 
              className="flex items-center gap-2 bg-white/[0.02] border border-white/5 print:border-slate-300 print:bg-slate-50 px-3 py-1.5 rounded-xl text-xs hover:border-white/10 transition"
              title={person.email || ''}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm print:bg-slate-300 print:text-black ${participantsColors[index % participantsColors.length]}`}>
                {getInitials(person.name)}
              </div>
              <div>
                <p className="font-semibold text-white print:text-black">{person.name}</p>
                <p className="text-[10px] text-slate-500 print:text-slate-600 font-medium">{person.role || 'Attendee'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Narrative Agenda / Summary */}
      {meeting.summary && (
        <div className="bg-[#1a1a1f]/40 border border-white/5 print:border-slate-300 print:bg-slate-50 rounded-2xl p-4 space-y-2">
          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1 print:text-indigo-800">
            <span>Executive Memo / Agenda Summary</span>
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed font-sans print:text-slate-900">
            {meeting.summary.agenda}
          </p>
        </div>
      )}

      {/* Highlights & Bullet Points */}
      {meeting.summary && meeting.summary.highlights && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-2 print:text-slate-700">
            <FileText className="w-4 h-4 text-indigo-400 print:text-indigo-800" />
            <span>Key Highlights & Minutes</span>
          </h4>
          <ul className="grid grid-cols-1 gap-2.5">
            {meeting.summary.highlights.map((bullet, idx) => (
              <li 
                key={idx} 
                className="bg-[#1a1a1f]/20 hover:bg-[#1a1a1f]/40 border border-white/5 print:border-slate-300 p-3.5 rounded-2xl text-sm text-slate-300 print:text-slate-900 leading-relaxed flex gap-3 transition"
              >
                <span className="w-5 h-5 bg-indigo-500/10 text-indigo-400 font-mono text-[10px] font-bold flex items-center justify-center rounded-lg border border-indigo-500/20 shrink-0 mt-0.5 print:bg-slate-200 print:text-black print:border-slate-300">
                  {idx + 1}
                </span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Key Decisions Banner */}
      {meeting.summary && meeting.summary.decisions && meeting.summary.decisions.length > 0 && (
        <div className="space-y-3 pt-1">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-2 print:text-slate-700">
            <ArrowUpRight className="w-4 h-4 text-emerald-400 print:text-emerald-700" />
            <span>Strategic Decisions Settled</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 print:grid-cols-1">
            {meeting.summary.decisions.map((dec, idx) => (
              <div 
                key={idx} 
                className="bg-emerald-500/[0.03] hover:bg-emerald-500/[0.06] border border-emerald-500/10 print:border-slate-300 print:bg-emerald-100/10 p-4 rounded-2xl space-y-2 transition"
              >
                <p className="text-xs font-bold text-emerald-400 print:text-emerald-800 tracking-wide flex items-center gap-1.5 uppercase">
                  <span>Decision {idx + 1}</span>
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  <span className="font-semibold text-slate-500 print:text-slate-600 normal-case">By {dec.who}</span>
                </p>
                <p className="font-sans font-semibold text-white print:text-black text-sm leading-snug">
                  {dec.decision}
                </p>
                {dec.context && (
                  <p className="text-xs text-slate-400 print:text-slate-700 leading-relaxed pt-1 border-t border-white/5 print:border-slate-300">
                    <span className="font-semibold text-slate-300 print:text-slate-800">Context:</span> {dec.context}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transcript Collapsible Box */}
      {meeting.transcript && (
        <div className="border border-white/5 rounded-2xl overflow-hidden mt-6 print:hidden">
          <button
            onClick={() => setShowTranscript(prev => !prev)}
            className="w-full bg-white/[0.02] hover:bg-white/[0.04] px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-300 tracking-wider uppercase transition cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Full Raw Verification Transcript</span>
            </span>
            {showTranscript ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showTranscript && (
            <div className="p-4 bg-[#0d0d0f] border-t border-white/5 space-y-3.5">
              {/* Search transcript */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Query / Search keywords in dialogue..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-1.5 bg-white/[0.02] border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500/20 text-xs text-slate-100 placeholder-slate-600"
                />
                <span className="absolute left-3 top-2 text-slate-500 font-medium text-xs">🔍</span>
              </div>

              {/* Dialog Lines */}
              <div className="max-h-64 overflow-y-auto rounded-lg bg-[#121214] p-4 border border-white/5 font-sans text-xs text-slate-400 leading-relaxed whitespace-pre-line space-y-2">
                {filteredTranscriptLines.length > 0 ? (
                  filteredTranscriptLines.map((line, idx) => {
                    const markerIdx = line.indexOf(':');
                    if (markerIdx > 0 && markerIdx < 35) {
                      const speaker = line.substring(0, markerIdx);
                      const speech = line.substring(markerIdx + 1);
                      return (
                        <p key={idx} className="mb-2">
                          <strong className="text-slate-200 font-semibold">{speaker}:</strong>
                          <span>{speech}</span>
                        </p>
                      );
                    }
                    return <p key={idx} className="mb-2">{line}</p>;
                  })
                ) : (
                  <p className="text-slate-500 text-center py-4">No matching words or empty transcript found.</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
