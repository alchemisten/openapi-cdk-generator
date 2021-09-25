export interface GenerateCommandConfig {
    specPath?: string;
    name?: string;
    lambdaPrefix?: string;
    lambdasPath?: string;
    constructsPath?: string;
}

export type GeneratedFilesMap = Record<string, GenerateFileStat>;

export type GenerateFileStat = NewFileStat | UpdateFileStat | DeleteFileStat | ExistingFileStat;

export interface NewFileStat {
    action: 'create';
    newHash: string;
}

export interface UpdateFileStat {
    action: 'update';
    newHash: string;
    oldHash: string;
}

export interface DeleteFileStat {
    action: 'delete';
    oldHash: string;
}

export interface ExistingFileStat {
    action: 'noop';
    oldHash: string;
}
