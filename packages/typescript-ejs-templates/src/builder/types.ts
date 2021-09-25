import { BlockType, SourceFileProps, TypeImportInfo } from '../templates';

export interface ITemplateBuilder {
    getSourceFiles(): Record<string, string>;
    addSourceFile(): ISourceFileBuilder;

    reportSourceFile(filePath: string, sourceFile: string): void;
}

export interface ISourceFileBuilder extends SourceFileProps {
    addImport(info: TypeImportInfo): ISourceFileBuilder;
    addBlock(block: BlockType): ISourceFileBuilder;

    build(filePath: string): ITemplateBuilder;
}
