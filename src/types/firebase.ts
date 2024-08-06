import { PriorityType, TaskStatusType } from ".";

export interface DataRegister {
  uid: string;
  username: string;
  email: string;
  password: string;
  createAt: number;
  jwtToken: string;
}

export interface DataProject {
  projectId: string;
  projectName: string;
  description: string;
  createAt: number;
}

export interface DataTask {
  userId: string;
  taskId: string;
  projectId: string;
  title: string;
  description: string;
  storyPoint: 1 | 2 | 3 | 5 | 8 | 13 | 21;
  taskStatus: TaskStatusType;
  startDate: number;
  dueDate: number;
  priority: PriorityType;
}
