import { useState } from 'react';
import { CheckSquare, Square, Calendar, User, Search, Play, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';
import { Task, Participant } from '../types';

interface TasksListProps {
  tasks: Task[];
  participants: Participant[];
  onToggleTaskStatus: (taskId: string) => void;
  onUpdateTaskStatus: (taskId: string, status: Task['status']) => void;
}

export default function TasksList({ tasks, participants, onToggleTaskStatus, onUpdateTaskStatus }: TasksListProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  const getPersonColorClass = (name: string) => {
    const idx = participants.findIndex(p => p.name.toLowerCase() === name.toLowerCase());
    if (idx === -1) return 'bg-white/5 text-slate-300 border-white/5';
    return participantsColors[idx % participantsColors.length];
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesAssignee = assigneeFilter === 'all' || task.assignedTo.toLowerCase() === assigneeFilter.toLowerCase();
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesAssignee && matchesSearch;
  });

  const getPriorityBadge = (prio: Task['priority']) => {
    switch (prio) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 text-[10px] font-bold uppercase tracking-wider border border-rose-500/20">
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            <span>High</span>
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">
            <span>Medium</span>
          </span>
        );
      case 'low':
        default:
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-white/5 text-slate-400 text-[10px] font-semibold uppercase tracking-wider border border-white/5">
              <span>Low</span>
            </span>
          );
    }
  };

  return (
    <div id="tasks-checklist-card" className="bg-[#121214] rounded-3xl border border-white/5 p-6 shadow-sm space-y-5">
      {/* Header and filters count */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h3 className="font-sans font-bold text-white text-sm flex items-center gap-2">
            <CheckSquare className="w-4.5 h-4.5 text-indigo-400" />
            <span>Assigned Action Items Checklist</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Real-time status tracking & individual workload alignment</p>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1 bg-white/5 border border-white/5 rounded-lg text-xs font-mono font-bold text-slate-400">
          <span>{filteredTasks.length} shown</span>
        </div>
      </div>

      {/* Control Filters Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pb-2">
        {/* Search */}
        <div className="sm:col-span-5 relative">
          <input
            type="text"
            placeholder="Search action items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3.5 py-1.5 bg-white/[0.02] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs text-slate-100 placeholder-slate-600"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
        </div>

        {/* Assignee Selection */}
        <div className="sm:col-span-4">
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-[#121214] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs text-slate-300 font-semibold"
          >
            <option value="all">👥 All Action Assignees</option>
            {participants && participants.map((p, idx) => (
              <option key={idx} value={p.name}>{p.name} ({p.role || 'Attendee'})</option>
            ))}
          </select>
        </div>

        {/* Status Tab buttons */}
        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full px-2.5 py-1.5 bg-[#121214] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs text-slate-300 font-semibold"
          >
            <option value="all">🔍 All Statuses</option>
            <option value="pending">⏳ Pending</option>
            <option value="in_progress">⚙️ In Progress</option>
            <option value="completed">✅ Completed</option>
          </select>
        </div>
      </div>

      {/* Action Items List */}
      {filteredTasks.length > 0 ? (
        <div className="space-y-3.5">
          {filteredTasks.map((task) => {
            const isFinished = task.status === 'completed';
            const isActive = task.status === 'in_progress';
            
            return (
              <div 
                key={task.id}
                className={`border rounded-xl p-4.5 flex flex-col md:flex-row md:items-start gap-4 transition shadow-sm hover:shadow ${
                  isFinished 
                    ? 'border-emerald-500/10 bg-emerald-500/[0.02]' 
                    : isActive 
                    ? 'border-indigo-500/10 bg-indigo-500/[0.02]' 
                    : 'border-white/5 bg-white/[0.02]'
                }`}
              >
                {/* Complete Status Checkbox click */}
                <button
                  onClick={() => onToggleTaskStatus(task.id)}
                  className="mt-0.5 focus:outline-none shrink-0 cursor-pointer text-slate-500 hover:text-indigo-400 transition"
                >
                  {isFinished ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400 fill-emerald-500/10" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>

                {/* Info Text */}
                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h5 className={`font-sans font-semibold text-white text-sm leading-snug ${isFinished ? 'line-through text-slate-500' : ''}`}>
                      {task.title}
                    </h5>
                    {getPriorityBadge(task.priority)}
                  </div>
                  <p className={`text-xs text-slate-300 leading-relaxed ${isFinished ? 'text-slate-500' : ''}`}>
                    {task.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2 text-[10px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>Due: {task.dueDate}</span>
                    </span>
                  </div>
                </div>

                {/* Assignee & Status Adjust Controls */}
                <div className="flex md:flex-col items-end justify-between md:justify-center gap-3 border-t md:border-t-0 border-white/5 pt-3.5 md:pt-0 shrink-0">
                  {/* Assignee Badge info */}
                  <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border border-transparent text-[10px] font-bold uppercase tracking-wide bg-slate-900 ${getPersonColorClass(task.assignedTo)}`}>
                    <div className="w-4 h-4 rounded-full bg-black/20 flex items-center justify-center text-[8px] font-bold">
                      {getInitials(task.assignedTo)}
                    </div>
                    <span>{task.assignedTo.split(' ')[0]}</span>
                  </div>

                  {/* Operational Controls */}
                  <div className="flex items-center gap-1 pt-1">
                    {!isFinished && !isActive && (
                      <button
                        onClick={() => onUpdateTaskStatus(task.id, 'in_progress')}
                        className="p-1 text-indigo-400 hover:bg-indigo-500/10 border border-indigo-500/20 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition select-none"
                        title="Start active work"
                      >
                        <Play className="w-3 h-3 fill-indigo-400 text-indigo-400" />
                        <span>Work on Task</span>
                      </button>
                    )}

                    {!isFinished && isActive && (
                      <button
                        onClick={() => onUpdateTaskStatus(task.id, 'completed')}
                        className="p-1 text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition select-none"
                        title="Mark as completed"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Complete Task</span>
                      </button>
                    )}

                    {isFinished && (
                      <button
                        onClick={() => onUpdateTaskStatus(task.id, 'pending')}
                        className="p-1 text-amber-400 hover:bg-amber-500/10 border border-amber-500/20 rounded text-[10px] font-semibold flex items-center gap-0.5 cursor-pointer transition select-none"
                        title="Reopen action item"
                      >
                        <span>Reopen Task</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-10 text-center border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
          <p className="text-xs text-slate-500 font-medium font-sans">No tasks found matching status or search filters.</p>
        </div>
      )}
    </div>
  );
}
