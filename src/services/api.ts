/**
 * Kafil MVP API — JSON-powered simulation layer
 *
 * Architecture:
 *  • db.json  → the "factory reset" dataset (users + projects)
 *  • localStorage['kafil_db'] → runtime state (seeded from db.json on first load)
 *
 * All reads/writes go to localStorage so changes persist across page reloads.
 * Resetting to db.json: call api.resetDb() or clear localStorage.
 */

import SEED from '@/data/db.json';
import { Project, Task, User, Database } from '@/types';

const DB_KEY = 'kafil_db';

/* ─── Internal helpers ─── */

const getDb = (): Database => {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) {
    // First visit — seed from JSON file
    const seed = SEED as Database;
    localStorage.setItem(DB_KEY, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(raw) as Database;
};

const saveDb = (db: Database) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

/* ─── Lookup helpers ─── */

const findUserByIdOrEmail = (db: Database, query: string): User | undefined => {
  const q = query.trim().toLowerCase();
  return db.users.find(
    (u) => u.id === q || u.email.toLowerCase() === q || u.username.toLowerCase() === q
  );
};

/* ─── Public API ─── */

export const api = {

  /* ---------- USERS ---------- */

  getUsers: async (): Promise<User[]> => {
    return getDb().users;
  },

  getUserById: async (id: string): Promise<User> => {
    const user = getDb().users.find((u) => u.id === id);
    if (!user) throw new Error(`User not found: ${id}`);
    return user;
  },

  /** Lookup a user by ID, email, or username (for invite forms) */
  lookupUser: async (query: string): Promise<User | null> => {
    return findUserByIdOrEmail(getDb(), query) ?? null;
  },

  /* ---------- PROJECTS ---------- */

  getProjects: async (): Promise<Project[]> => {
    return getDb().projects;
  },

  /** Returns only projects owned by a specific user ID */
  getProjectsByOwner: async (ownerId: string): Promise<Project[]> => {
    return getDb().projects.filter((p) => p.ownerId === ownerId);
  },

  /** Returns projects where a user has at least one accepted/pending task */
  getProjectsForFreelancer: async (userId: string): Promise<Project[]> => {
    const db = getDb();
    const user = db.users.find((u) => u.id === userId);
    if (!user) return [];
    return db.projects.filter((p) =>
      p.tasks.some(
        (t) =>
          t.assignedTo === userId ||
          (user.email && t.assignedToEmail?.toLowerCase() === user.email.toLowerCase())
      )
    );
  },

  getProject: async (id: string): Promise<Project> => {
    const project = getDb().projects.find((p) => p.id === id);
    if (!project) throw new Error('Project not found');
    return project;
  },

  createProject: async (data: {
    title: string;
    description?: string;
    budget: number;
    ownerId: string;
    category?: string;
  }): Promise<Project> => {
    const db = getDb();
    const owner = db.users.find((u) => u.id === data.ownerId);
    if (!owner) throw new Error('Owner not found');

    const newProject: Project = {
      id: `proj_${Date.now()}`,
      title: data.title,
      description: data.description,
      budget: Number(data.budget),
      owner: owner.name,
      ownerUsername: owner.username,
      ownerId: data.ownerId,
      escrow: true,
      category: data.category,
      createdAt: new Date().toISOString().split('T')[0],
      tasks: [],
    };
    db.projects.push(newProject);
    saveDb(db);
    return newProject;
  },

  /* ---------- TASKS / INVITES ---------- */

  /**
   * Add a task and invite a freelancer by ID, email, or username.
   * The task is created with inviteStatus: 'Pending' until the freelancer accepts.
   */
  addTask: async (
    projectId: string,
    data: {
      name: string;
      description?: string;
      payment: number;
      deadline?: string;
      /** ID, email, or username of the freelancer to invite */
      freelancerQuery: string;
    }
  ): Promise<Task> => {
    const db = getDb();
    const project = db.projects.find((p) => p.id === projectId);
    if (!project) throw new Error('Project not found');

    // Resolve freelancer
    const freelancer = findUserByIdOrEmail(db, data.freelancerQuery);

    const newTask: Task = {
      id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: data.name,
      description: data.description,
      assignedTo: freelancer?.id ?? data.freelancerQuery,
      assignedToEmail: freelancer?.email ?? (data.freelancerQuery.includes('@') ? data.freelancerQuery : undefined),
      assignedToName: freelancer?.name ?? data.freelancerQuery,
      payment: Number(data.payment),
      status: 'Pending',
      paid: false,
      inviteStatus: 'Pending',
      deadline: data.deadline,
    };

    project.tasks.push(newTask);
    saveDb(db);
    return newTask;
  },

  completeTask: async (projectId: string, taskId: string): Promise<Task> => {
    const db = getDb();
    const project = db.projects.find((p) => p.id === projectId);
    if (!project) throw new Error('Project not found');
    const task = project.tasks.find((t) => t.id === taskId);
    if (!task) throw new Error('Task not found');
    task.paid = true;
    task.status = 'Completed';
    saveDb(db);
    return task;
  },

  updateTaskStatus: async (projectId: string, taskId: string, status: Task['status']): Promise<Task> => {
    const db = getDb();
    const project = db.projects.find((p) => p.id === projectId);
    if (!project) throw new Error('Project not found');
    const task = project.tasks.find((t) => t.id === taskId);
    if (!task) throw new Error('Task not found');
    task.status = status;
    saveDb(db);
    return task;
  },

  updateInviteStatus: async (
    projectId: string,
    taskId: string,
    status: 'Accepted' | 'Rejected'
  ): Promise<Task> => {
    const db = getDb();
    const project = db.projects.find((p) => p.id === projectId);
    if (!project) throw new Error('Project not found');
    const task = project.tasks.find((t) => t.id === taskId);
    if (!task) throw new Error('Task not found');
    task.inviteStatus = status;
    if (status === 'Accepted') task.status = 'In Progress';
    saveDb(db);
    return task;
  },

  submitTaskWork: async (
    projectId: string,
    taskId: string,
    data: { deliverableFile: string; deliverableNote?: string }
  ): Promise<Task> => {
    const db = getDb();
    const project = db.projects.find((p) => p.id === projectId);
    if (!project) throw new Error('Project not found');
    const task = project.tasks.find((t) => t.id === taskId);
    if (!task) throw new Error('Task not found');
    task.deliverableFile = data.deliverableFile;
    task.deliverableNote = data.deliverableNote;
    task.submittedAt = new Date().toISOString();
    task.status = 'Pending'; // Change status back to Pending (Waiting for approval)
    saveDb(db);
    return task;
  },

  openDispute: async (projectId: string, taskId: string): Promise<Task> => {
    const db = getDb();
    const project = db.projects.find((p) => p.id === projectId);
    if (!project) throw new Error('Project not found');
    const task = project.tasks.find((t) => t.id === taskId);
    if (!task) throw new Error('Task not found');
    task.status = 'Disputed';
    saveDb(db);
    return task;
  },

  /* ---------- AUTH SIMULATION ---------- */

  /** Simulate login — just checks username/email exists, returns the user */
  login: async (query: string, _password: string): Promise<User> => {
    const user = findUserByIdOrEmail(getDb(), query);
    if (!user) throw new Error('المستخدم غير موجود');
    return user;
  },

  /** Get current logged-in user from localStorage */
  getCurrentUser: (): User | null => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  },

  /* ---------- UTILITIES ---------- */

  /** Wipe runtime state and re-seed from db.json */
  resetDb: (): void => {
    localStorage.setItem(DB_KEY, JSON.stringify(SEED as Database));
  },

  /** Get all users (for admin views / invite lookups) */
  searchUsers: async (query: string): Promise<User[]> => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return getDb().users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q)
    );
  },
};
