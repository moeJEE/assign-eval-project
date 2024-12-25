// src/app/models/project.model.ts

export interface Skill {
  id: number; // integer($int64)
  name: string;
  description?: string;
  createdAt?: string;
  modifiedAt?: string;
}

export interface Evaluation {
  evaluationId: number;
  projectId: number;
  projectManagerId: number;
  developerId: number;
  developerName: string;
  rating: number;
  feedback: string;
  createdAt: string;
}

export interface Role {
  id: number;
  name: 'PROJECT_MANAGER' | 'DEVELOPER';
  createdAt?: string;
  modifiedAt?: string;
  users?: User[];
}

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  accountLocked?: boolean;
  enabled?: boolean;
  dateOfBirth?: string;
  portfolio?: string;
  available?: boolean;
  roles?: Role[];
  skills?: Skill[];
  createdAt?: string;
  modifiedAt?: string;
  authorities?: GrantedAuthority[];
  username?: string;
  accountNonExpired?: boolean;
  credentialsNonExpired?: boolean;
  accountNonLocked?: boolean;
  avatar?: string;
}

export interface GrantedAuthority {
  authority: string;
}

export interface Project {
  id?: number;
  code: string;
  title: string;
  description?: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'REVIEW';
  startDate: string;
  endDate: string;
  skills: Skill[];
  skillIds?: number[];
  developers: Developer[];
  developerIds?: number[];
  projectManager?: Developer;
  projectManagerId?: number;
  evaluations?: Evaluation[];
  createdAt?: string;
  modifiedAt?: string;
  avatar?: string;
}

export interface ProjectRequest {
  id?: number;
  code: string;
  title: string;
  description?: string;
  status: string;
  startDate: string;
  endDate: string;
  skillIds: number[];
  developerIds: number[];
  projectManagerId: number;
}

export interface ProjectResponse extends Project {
  skillIds: number[];
  developerIds: number[];
  projectManagerId: number;
  evaluationIds?: number[];
}

export interface RegistrationRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: 'DEVELOPER' | 'PROJECT_MANAGER';
}

export interface AuthenticationRequest {
  email: string;
  password: string;
}

export interface AuthenticationResponse {
  token: string;
}

export interface Developer {
  id?: number;
  firstname: string;
  lastname: string;
  email: string;
  portfolio?: string;
  skills: { skillId: number; skillName: string }[];  // Correctly typed
  roles: number[];
  available: boolean;
  enabled: boolean;
  createdAt: string;
  avatar?: string;
  password?: string;
}


export interface DeveloperPayload {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  roleIds: number[];
  skills: number[];
  available: boolean;
  enabled: boolean;
  portfolio?: string;
}


