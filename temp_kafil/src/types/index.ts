export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Disputed';

export interface Task {
  id: string;
  name: string;
  assignedTo: string;
  payment: number;
  status: TaskStatus;
  paid: boolean;
}

export interface Project {
  id: string;
  title: string;
  budget: number;
  owner: string;
  ownerUsername: string;
  escrow: boolean;
  tasks: Task[];
}

export type UserRole = 'admin' | 'client' | 'freelancer' | 'coordinator' | 'arbitrator';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
}

export interface Database {
  projects: Project[];
}
