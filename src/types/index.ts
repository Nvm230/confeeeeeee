export interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  createdAt?: string;
  updatedAt?: string;
  tasks?: Task[];
}

export type ProjectStatus = 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  assignedTo?: string;
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
  project?: Project;
  assignedUser?: User;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface TeamMember {
  id: number;
  name: string;
  email: string;
}

// API Response types
export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
}

export interface ProjectsResponse {
  projects: Project[];
  totalPages: number;
  currentPage: number;
}

export interface TasksResponse {
  tasks: Task[];
  totalPages: number;
}

export interface TeamMembersResponse {
  members: TeamMember[];
}

export interface MemberTasksResponse {
  tasks: Task[];
}

export interface ApiError {
  message: string;
  error?: string;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  name: string;
}

export interface ProjectFormData {
  name: string;
  description?: string;
  status: ProjectStatus;
}

export interface TaskFormData {
  title: string;
  description?: string;
  projectId: string;
  priority: TaskPriority;
  dueDate?: string;
  assignedTo?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  assignedTo?: string;
}

