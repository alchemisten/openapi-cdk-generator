import { Writable } from 'stream';
import chalk from 'chalk';
import { Command } from 'clipanion';
import { ILogger, LogVerbosity } from './types';

export interface CommandContextLoggerProps {
    stdOut: Writable;
    stdErr: Writable;
    verbosity: LogVerbosity;
}

export class CommandContextLogger implements ILogger {
    public static forCommand(command: Command, verbosity: LogVerbosity): ILogger {
        return new CommandContextLogger({
            stdOut: command.context?.stdout ?? process.stdout,
            stdErr: command.context?.stderr ?? process.stderr,
            verbosity,
        });
    }

    // eslint-disable-next-line no-useless-constructor,@typescript-eslint/explicit-member-accessibility
    constructor(private props: CommandContextLoggerProps) {}

    public log(verbosity: LogVerbosity, message: string): void {
        if (verbosity < this.props.verbosity) {
            return;
        }
        let prefix;
        let colorizer: (value: string) => string;

        switch (verbosity) {
            case LogVerbosity.ERROR:
                prefix = 'ERROR';
                colorizer = chalk.keyword('red');
                break;
            case LogVerbosity.WARN:
                prefix = 'WARN';
                colorizer = chalk.keyword('orange');
                break;
            case LogVerbosity.INFO:
                prefix = 'INFO';
                colorizer = chalk.keyword('cyan');
                break;
            default:
                prefix = 'VERBOSE';
                colorizer = (value: string) => value;
        }

        const formattedMessage = `${chalk.inverse(colorizer(` ${prefix} `))}: ${colorizer(message)}\n`;
        const isError = verbosity === LogVerbosity.ERROR || verbosity === LogVerbosity.WARN;

        (isError ? this.props.stdErr : this.props.stdOut).write(formattedMessage);
    }

    public error(message: string): number {
        this.log(LogVerbosity.ERROR, message);
        return 1;
    }

    public info(message: string): void {
        this.log(LogVerbosity.INFO, message);
    }

    public verbose(message: string): void {
        this.log(LogVerbosity.VERBOSE, message);
    }

    public warn(message: string): void {
        this.log(LogVerbosity.WARN, message);
    }
}
