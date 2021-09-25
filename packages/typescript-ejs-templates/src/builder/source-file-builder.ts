import { EjsTypescriptUtils } from '../ejs-typescript-utils';
import { BlockType, sourceFileTemplate, TypeImportInfo } from '../templates';
import { ISourceFileBuilder, ITemplateBuilder } from './types';

export class TypescriptSourceFileBuilder implements ISourceFileBuilder {
    public imports: TypeImportInfo[] = [];

    public blocks: BlockType[] = [];

    public constructor(protected templateBuilder: ITemplateBuilder) {}

    public addImport(info: TypeImportInfo): ISourceFileBuilder {
        this.imports.push(info);
        return this;
    }

    public addBlock(block: BlockType): ISourceFileBuilder {
        this.blocks.push(block);
        return this;
    }

    public build(filePath: string): ITemplateBuilder {
        const sourceFile = EjsTypescriptUtils.render(sourceFileTemplate, this);
        this.templateBuilder.reportSourceFile(filePath, sourceFile);
        return this.templateBuilder;
    }
}
