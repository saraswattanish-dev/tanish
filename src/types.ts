export interface Participant {
  name: string;
  role: string;
  avatarUrl?: string;
  email?: string;
}

export interface Decision {
  decision: string;
  who: string;
  context?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string; // Must match one of the participant names
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
}

export interface MeetingSummary {
  agenda: string;
  highlights: string[];
  decisions: Decision[];
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: string; // e.g. "24 mins"
  audioLengthSec?: number;
  participants: Participant[];
  transcript?: string;
  summary?: MeetingSummary;
  tasks: Task[];
  status: 'processing' | 'completed' | 'failed';
  audioUrl?: string;
  isFallback?: boolean;
  fallbackReason?: string;
  fallbackError?: string;
}

export interface CreateMeetingResponse {
  success: boolean;
  meeting: Meeting;
  error?: string;
}
