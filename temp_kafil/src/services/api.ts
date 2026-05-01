import { Project, Task, Database } from '@/types';

const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj_1",
    title: "E-commerce Website",
    budget: 3000,
    owner: "Ahmed Khaled",
    ownerUsername: "ahmed_k",
    escrow: true,
    tasks: [
      { id: "task_1", name: "UI Design", assignedTo: "Sara", payment: 800, status: "Completed", paid: true },
      { id: "task_2", name: "Frontend", assignedTo: "Omar", payment: 200, status: "In Progress", paid: false },
      { id: "task_3", name: "Backend", assignedTo: "Lina", payment: 1000, status: "Pending", paid: false }
    ]
  },
  {
    id: "proj_2",
    title: "Mobile App",
    budget: 5000,
    owner: "Sara Nasser",
    ownerUsername: "sara_n",
    escrow: true,
    tasks: [
      { id: "task_4", name: "UX Wireframing", assignedTo: "Sara", payment: 1000, status: "Completed", paid: true },
      { id: "task_5", name: "App Development", assignedTo: "Lina", payment: 4000, status: "Pending", paid: false }
    ]
  }
];

const getDb = (): Database => {
  const db = localStorage.getItem('kafeel_db');
  if (!db) {
    localStorage.setItem('kafeel_db', JSON.stringify({ projects: INITIAL_PROJECTS }));
    return { projects: INITIAL_PROJECTS };
  }
  return JSON.parse(db);
};

const saveDb = (data: Database) => {
  localStorage.setItem('kafeel_db', JSON.stringify(data));
};

export const api = {
  getProjects: async (): Promise<Project[]> => {
    return getDb().projects;
  },
  getProject: async (id: string): Promise<Project> => {
    const project = getDb().projects.find(p => p.id === id);
    if (!project) throw new Error('Project not found');
    return project;
  },
  createProject: async (data: Partial<Project> & { title: string; budget: number; owner: string }): Promise<Project> => {
    const db = getDb();
    const newProject: Project = {
      id: Date.now().toString(),
      title: data.title,
      budget: Number(data.budget),
      owner: data.owner,
      ownerUsername: data.ownerUsername || data.owner.toLowerCase().replace(/\s+/g, '_'),
      escrow: true,
      tasks: []
    };
    db.projects.push(newProject);
    saveDb(db);
    return newProject;
  },
  addTask: async (projectId: string, data: Partial<Task> & { name: string; payment: number; assignedTo: string }): Promise<Task> => {
    const db = getDb();
    const project = db.projects.find(p => p.id === projectId);
    if (!project) throw new Error('Project not found');
    
    const newTask: Task = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      name: data.name,
      assignedTo: data.assignedTo,
      payment: Number(data.payment),
      status: data.status || 'Pending',
      paid: data.paid || false
    };
    project.tasks.push(newTask);
    saveDb(db);
    return newTask;
  },
  completeTask: async (projectId: string, taskId: string): Promise<Task> => {
    const db = getDb();
    const project = db.projects.find(p => p.id === projectId);
    if (!project) throw new Error('Project not found');
    
    const task = project.tasks.find(t => t.id === taskId);
    if (!task) throw new Error('Task not found');
    
    task.paid = true;
    saveDb(db);
    return task;
  }
};
