import { cosmiconfigSync } from 'cosmiconfig';
import prettier, { Options } from 'prettier';
import { ICodeFormatter } from './types';

export class PrettierCodeFormatter implements ICodeFormatter {
    public static fromLocalConfig(): PrettierCodeFormatter {
        let options: Options = {};

        const prettierConfig = cosmiconfigSync('prettier').search();

        if (prettierConfig) {
            options = prettierConfig.config;
        }

        if (!prettierConfig) {
            const esLintConfig = cosmiconfigSync('eslint').search();

            if (esLintConfig && esLintConfig?.config?.rules?.['prettier/prettier']) {
                const esLintPrettierOptions = esLintConfig?.config?.rules?.['prettier/prettier'].find(
                    (item: unknown) => typeof item === 'object'
                );

                if (esLintPrettierOptions) {
                    options = esLintPrettierOptions;
                }
            }
        }

        return new PrettierCodeFormatter(options);
    }

    public constructor(protected prettierOptions: Options) {}

    public format(code: string): string {
        return prettier.format(code, {
            parser: 'babel-ts',
            ...this.prettierOptions,
        });
    }
}
