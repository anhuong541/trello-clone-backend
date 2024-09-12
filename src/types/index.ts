export type TaskStatusType = "Open" | "In-progress" | "Resolved" | "Closed";
export type PriorityType = "Low" | "Medium" | "High";
export type AuthorityType = "Owner" | "Edit" | "View";

export interface TaskType {
  taskId: string;
  projectId: string;
  // positionId: string;
  title: string;
  description: string;
  taskStatus: TaskStatusType;
  storyPoint: 1 | 2 | 3 | 5 | 8 | 13 | 21;
  startDate: number;
  dueDate: number;
  priority: PriorityType;
}

export interface ProjectType {
  projectId: string;
  projectName: string;
  description: string;
  createAt: number;
  members: string[];
  authority: { [key in string]: AuthorityType[] };
}

export interface DataUserProject {
  projectId: string;
  projectName: string;
  description: string;
  dueTime: number;
  createAt: number;
}

export interface NewDataProject {
  projectId: string;
  projectName: string;
  description: string;
  createAt: number;
  dueTime: number;
}
