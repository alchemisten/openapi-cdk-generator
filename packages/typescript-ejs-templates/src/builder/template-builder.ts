import { ICodeFormatter } from '../formatter';
import { TypescriptSourceFileBuilder } from './source-file-builder';
import { ISourceFileBuilder, ITemplateBuilder } from './types';

export interface TypescriptEjsTemplateBuilderProps {
    formatter?: ICodeFormatter;
}

export class TypescriptEjsTemplateBuilder implements ITemplateBuilder {
    protected sourceFiles: Record<string, string> = {};

    public constructor(protected props: TypescriptEjsTemplateBuilderProps) {}

    public addSourceFile(): ISourceFileBuilder {
        return new TypescriptSourceFileBuilder(this);
    }

    public reportSourceFile(filePath: string, sourceFile: string): void {
        const { formatter } = this.props;
        this.sourceFiles[filePath] = formatter ? formatter.format(sourceFile) : sourceFile;
    }

    public getSourceFiles(): Record<string, string> {
        return this.sourceFiles;
    }
}
