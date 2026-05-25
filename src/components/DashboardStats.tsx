import { Calendar, CheckSquare, Users, TrendingUp, Inbox } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { Meeting, Task } from '../types';

interface DashboardStatsProps {
  meetings: Meeting[];
}

export default function DashboardStats({ meetings }: DashboardStatsProps) {
  // Aggregate stats
  const totalMeetings = meetings.length;
  
  const allTasks = meetings.reduce<Task[]>((acc, m) => {
    if (m.tasks) acc.push(...m.tasks);
    return acc;
  }, []);

  const totalTasks = allTasks.length;
  const pendingTasks = allTasks.filter(t => t.status === 'pending').length;
  const inProgressTasks = allTasks.filter(t => t.status === 'in_progress').length;
  const completedTasks = allTasks.filter(t => t.status === 'completed').length;

  const totalParticipants = Array.from(
    new Set(meetings.flatMap(m => m.participants.map(p => p.name)))
  ).length;

  // Pie Chart Data: Statuses
  const statusData = [
    { name: 'Pending', value: pendingTasks, color: '#f59e0b' },      // Amber
    { name: 'In Progress', value: inProgressTasks, color: '#3b82f6' }, // Blue
    { name: 'Completed', value: completedTasks, color: '#10b981' }   // Emerald
  ].filter(d => d.value > 0);

  // Bar Chart Data: Task Workload per Person
  const workloadMap: { [name: string]: { pending: number, completed: number, count: number } } = {};
  allTasks.forEach(task => {
    const person = task.assignedTo || 'Unassigned';
    if (!workloadMap[person]) {
      workloadMap[person] = { pending: 0, completed: 0, count: 0 };
    }
    workloadMap[person].count += 1;
    if (task.status === 'completed') {
      workloadMap[person].completed += 1;
    } else {
      workloadMap[person].pending += 1;
    }
  });

  const workloadData = Object.keys(workloadMap).map(name => ({
    name,
    Pending: workloadMap[name].pending,
    Completed: workloadMap[name].completed,
    total: workloadMap[name].count
  })).sort((a, b) => b.total - a.total);

  return (
    <div id="analytics-grid-workspace" className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#121214] p-5 rounded-3xl border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Meetings</p>
            <h3 className="text-2xl font-bold text-white mt-1">{totalMeetings}</h3>
          </div>
          <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#121214] p-5 rounded-3xl border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Action Items</p>
            <h3 className="text-2xl font-bold text-white mt-1">{totalTasks}</h3>
          </div>
          <div className="p-2.5 bg-sky-500/10 text-sky-400 rounded-xl">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#121214] p-5 rounded-3xl border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Completed Tasks</p>
            <h3 className="text-2xl font-bold text-white mt-1">
              {completedTasks}
              <span className="text-slate-500 font-normal text-xs ml-1">
                ({totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%)
              </span>
            </h3>
          </div>
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#121214] p-5 rounded-3xl border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Collaborators</p>
            <h3 className="text-2xl font-bold text-white mt-1">{totalParticipants}</h3>
          </div>
          <div className="p-2.5 bg-pink-500/10 text-pink-400 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Recharts Visualizations */}
      {totalTasks > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Workload Breakdown */}
          <div className="bg-[#121214] p-5 rounded-3xl border border-white/5 md:col-span-8 flex flex-col justify-between">
            <div>
              <h4 className="font-sans font-semibold text-white text-sm">Action Items Workload by Member</h4>
              <p className="text-xs text-slate-500 mt-0.5">Distribution of remaining and completed deliverables</p>
            </div>
            
            <div className="h-48 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workloadData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} type="number" allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ background: '#0D0D0F', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', fontSize: '11px', boxShadow: 'none' }}
                  />
                  <Bar dataKey="Completed" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} barSize={25} />
                  <Bar dataKey="Pending" stackId="a" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={25} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Distribution (Pie / Doughnut) */}
          <div className="bg-[#121214] p-5 rounded-3xl border border-white/5 md:col-span-4 flex flex-col justify-between">
            <div>
              <h4 className="font-sans font-semibold text-white text-sm">Completion Status</h4>
              <p className="text-xs text-slate-500 mt-0.5">Overview of active assignment statuses</p>
            </div>

            <div className="h-44 relative flex items-center justify-center">
              {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: '#0D0D0F', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', fontSize: '11px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-xs text-slate-500">No active charts</p>
              )}
              
              <div className="absolute text-center flex flex-col items-center">
                <span className="text-xl font-bold text-white">{Math.round((completedTasks / totalTasks) * 100 || 0)}%</span>
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Done</span>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="flex justify-center gap-4 text-[10px] font-semibold text-slate-400 border-t border-white/5 pt-3">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span>Pending</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Active</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Done</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#121214]/60 border border-dashed border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-white/5 text-slate-400 rounded-full mb-3">
            <Inbox className="w-6 h-6" />
          </div>
          <p className="font-sans font-medium text-slate-200 text-sm">No analytics to display yet</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Record or select sample meeting audios in the sidebar to populate complete MOM dashboards and work status charts.
          </p>
        </div>
      )}
    </div>
  );
}
