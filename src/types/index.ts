export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Disputed';
export type PaymentStatus = 'Initiated' | 'Authorized' | 'Escrow Locked' | 'Awaiting Approval' | 'Released' | 'Disputed' | 'Refunded';
export type InviteStatus = 'Pending' | 'Accepted' | 'Rejected';
export type UserRole = 'admin' | 'client' | 'freelancer' | 'coordinator' | 'arbitrator';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  name: string;
  avatar: string;       // initials e.g. "AK"
  joinedAt: string;     // ISO date
  rating?: number;      // 1-5
  trustScore: number;   // 0-100%
  bio?: string;
  skills?: string[];
  balance: number;      // Current available balance
  lockedFunds: number;  // Funds in escrow
}

export interface Transaction {
  id: string;
  type: 'Deposit' | 'Lock' | 'Release' | 'Refund' | 'Service Fee' | 'Arbitration';
  amount: number;
  currency: string;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  timestamp: string;
  status: 'Completed' | 'Pending' | 'Failed';
  referenceId: string; // Task ID or Project ID
  description: string;
}

export interface TimelineEvent {
  status: PaymentStatus;
  timestamp: string;
  note?: string;
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
  paymentStatus: PaymentStatus;
  paid: boolean;
  inviteStatus?: InviteStatus;
  deadline?: string;
  deliverableNote?: string;
  deliverableFile?: string;
  submittedAt?: string;
  timeline: TimelineEvent[];
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
  ledger: Transaction[];
}
