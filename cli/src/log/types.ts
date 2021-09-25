export enum LogVerbosity {
    VERBOSE = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4,
}

export interface ILogger {
    colorful(prefix: string, message: string, color: string): void;
    log(verbosity: LogVerbosity, message: string): void;
    verbose(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void | number;
}
