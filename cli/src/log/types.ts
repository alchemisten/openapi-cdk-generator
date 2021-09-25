export enum LogVerbosity {
    VERBOSE = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4,
}

export interface ILogger {
    log(verbosity: LogVerbosity, message: string): void;
    verbose(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void | number;
}
