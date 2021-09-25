import { paramCase, pascalCase } from 'change-case';
import { ICodeFormatter, NoopFormatter, TypescriptEjsTemplateBuilder } from 'typescript-ejs-templates';
import {
    CDKConstructGenerateProps,
    CDKConstructGeneratorResult,
    ICDKConstructGenerator,
    NullableApiType,
    SourceFile,
} from '../types';
import { GeneratorFileTemplates } from './file-templates';

export interface CDKConstructGeneratorProps {
    formatter?: ICodeFormatter;
}

export class CDKConstructGeneratorImpl implements ICDKConstructGenerator {
    public constructor(protected props: CDKConstructGeneratorProps) {}

    protected static rawFilesToSourceFiles(files: Record<string, string>): Record<string, SourceFile> {
        return Object.entries(files).reduce<Record<string, SourceFile>>((stack, [filePath, content]) => {
            stack[filePath] = {
                filePath,
                content,
            };
            return stack;
        }, {});
    }

    public async generate<V extends NullableApiType>(
        request: CDKConstructGenerateProps<V>
    ): Promise<CDKConstructGeneratorResult<V>> {
        const folderApiName = paramCase(request.apiName);
        const cdkRoot = `src/generated/${folderApiName}`;
        const lambdasRoot = `src/lambdas/shared/generated/${folderApiName}`;

        const builder = new TypescriptEjsTemplateBuilder({
            formatter: this.props.formatter ?? new NoopFormatter(),
        });

        const lambdaFunctions = builder.addSourceFile();
        GeneratorFileTemplates.addLambdaFunctionImport(lambdaFunctions);

        for (const controller of Object.values(request.constructInfo.controllers)) {
            const functionsInterface = `I${pascalCase(controller.name)}Functions`;

            GeneratorFileTemplates.addLambdasInterfaceConstruct(lambdaFunctions, {
                className: functionsInterface,
                description: controller.description,
                operations: Object.values(controller.operations).map((operation) => {
                    return {
                        name: operation.operationId,
                        description: operation.description,
                    };
                }),
            });
        }

        lambdaFunctions.build(`${cdkRoot}/functions.ts`);

        return {
            spec: request.constructInfo.spec,
            outputs: CDKConstructGeneratorImpl.rawFilesToSourceFiles(builder.getSourceFiles()),
        };
    }
}
