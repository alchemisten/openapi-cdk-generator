import { Command } from 'clipanion';
import { CommandContextLogger } from '../log/command-log';
import { ILogger, LogVerbosity } from '../log/types';

export abstract class BaseCommand extends Command {
    public logger: ILogger;

    protected constructor() {
        super();
        this.logger = CommandContextLogger.forCommand(this, LogVerbosity.INFO);
    }

    protected updateLogger(args: string[]): void {
        const verboseLogging = args.includes('--verbose');

        this.logger = CommandContextLogger.forCommand(this, verboseLogging ? LogVerbosity.VERBOSE : LogVerbosity.INFO);
    }

    protected static filterDefaultArgs(args: string[]): string[] {
        return args.filter((arg) => arg !== '--verbose');
    }
}
