import { ICodeFormatter } from './types';

export class NoopFormatter implements ICodeFormatter {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    format(code: string): string {
        return code;
    }
}
