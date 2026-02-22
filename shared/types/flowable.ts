export interface FlowableTask {
    id: string;
    name: string;
    description: string | null;
    assignee: string | null;
    owner: string | null;
    createTime: string;
    dueDate: string | null;
    priority: number;
    processInstanceId: string;
    processDefinitionId: string;
    taskDefinitionKey: string;
    category: string | null;
    formKey: string | null;
}

export interface FlowableProcessInstance {
    id: string;
    url: string;
    businessKey: string | null;
    processDefinitionId: string;
    processDefinitionUrl: string;
    processDefinitionName: string;
    startTime: string;
    startUserId: string | null;
    suspended: boolean;
    ended: boolean;
}

export interface FlowableProcessDefinition {
    id: string;
    key: string;
    name: string;
    description: string | null;
    version: number;
    category: string;
    deploymentId: string;
    resourceName: string;
    diagramResourceName: string | null;
    suspended: boolean;
}

export interface FlowableVariable {
    name: string;
    type: string;
    value: any;
    scope?: string;
}

export interface FlowableFormDefinition {
    id: string;
    name: string;
    key: string;
    version: number;
    description: string | null;
}

export interface FlowableUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    privileges?: string[];
}

export interface FlowableGroup {
    id: string;
    name: string;
    type: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    start: number;
    sort: string;
    order: string;
    size: number;
}
