export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Disputed';
export type InviteStatus = 'Pending' | 'Accepted' | 'Rejected';
export type UserRole = 'admin' | 'client' | 'freelancer' | 'coordinator';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  name: string;
  avatar: string;       // initials e.g. "AK"
  joinedAt: string;     // ISO date
  rating?: number;      // 1-5
  bio?: string;
  skills?: string[];
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  assignedTo: string;           // user ID
  assignedToEmail?: string;     // used for invite lookup
  assignedToName?: string;      // display name (resolved from users)
  payment: number;
  status: TaskStatus;
  paid: boolean;
  inviteStatus?: InviteStatus;
  deadline?: string;
  deliverableNote?: string;
  deliverableFile?: string;
  submittedAt?: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  budget: number;
  owner: string;            // display name
  ownerUsername: string;
  ownerId: string;          // user ID
  escrow: boolean;
  category?: string;
  createdAt: string;
  tasks: Task[];
}

export interface Database {
  users: User[];
  projects: Project[];
}
