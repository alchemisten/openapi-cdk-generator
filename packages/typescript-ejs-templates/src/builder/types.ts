import {
    BlockType,
    ClassImplBlock,
    ClassImplProps,
    CommentProps,
    MemberFunctionBodyProps,
    PropertyInterface,
    SourceFileProps,
    TypeImportInfo,
} from '../templates';

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

export interface IClassBuilder extends ClassImplProps {
    setExtends(extend: string): IClassBuilder;
    setName(name: string): IClassBuilder;
    setComment(comment: CommentProps): IClassBuilder;
    setGeneric(generic: string): IClassBuilder;
    addImplementingInterface(...interfaces: string[]): IClassBuilder;
    addProperty(property: PropertyInterface): IClassBuilder;
    addMethod(method: Omit<MemberFunctionBodyProps, 'functionType'>): IClassBuilder;

    build(): ClassImplBlock;
}
