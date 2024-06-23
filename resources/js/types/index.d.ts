export interface User {
    assigned: any;
    id: number;
    photo:string;
    about: string;
    name: string;
    email: string;
    email_verified_at: string;
    current_team_id: number;
    teams: Team[];
    role:string;
}

export interface Invitation {
    id: number;
    team_id: number;
    user_id: number;
    role_id: number;
    email: string;
    token: string;
}

export interface Role {
    id: number;
    name: string;
    description: string;
    is_default: boolean;
}
export interface Team {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    owner_id: number;
    members: User[];
    owner: User;
    projects: Project[];
    tasks: Task[];
    invitations: Invitation[];
}

export interface Notification {
    created_at: String;
    id: number;
    type: string;
    data: any;
    read_at: string;
}

export interface Project {
    id: number;
    name: string;
    slug: string;
    description: string;
    created_at: string;
    updated_at: string;
    tasks_count: number;
    tasks: Task[]
}

export interface BreadcrumbType {
    name: string;
    href: string;
    current: boolean;
}

export interface ChecklistIem {
    id: number;
    title: string;
    completed: boolean;
    position: number;
    task_id: number;
    created_at: string;
    updated_at: string;
}

export interface Task {
    priority:string;
    id: number;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
    project_id: any;
    status: string;
    start_date: Date;
    end_date: Date;
    project: Project;
    user_id?: number;
    pinned?: 0 | 1;
    assignees?: User[];
    user?: User;
    checklist_items?: ChecklistIem[]
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
    projects: Project[];
    tasks: Task[];
    task: Task;
    users: User[];
    assignees: User[];
    teams: Team[];
    team:Team;
    roles: Role[];
    notifications: Notification[];
    flash: {
        success?: string;
        error?: string;
    }
};
