export interface UserType{
    id: number, 
    username: String,
    password: string,
    projects: ProjectType[]
}

export interface TodoType {
  id: number,
  title: string,  
  description?: string,
  created: Date,
  completed: true|false,
  dueDate: Date,
  priority?: 'low'|'medium'|'high',
  project: ProjectType,
}

export interface ProjectType {
  id: number,
  name: string,
  todos?: TodoType[],
  user: UserType
}