import { paramCase, pascalCase } from 'change-case';
import { ICodeFormatter, NoopFormatter, TypescriptEjsTemplateBuilder } from 'typescript-ejs-templates';
import {
    CDKConstructGenerateProps,
    CDKConstructGeneratorResult,
    ICDKConstructGenerator,
    NullableApiType,
    SourceFile,
} from '../types';
import { GeneratorFileTemplates, OperationDescriptor } from './file-templates';

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
        const constructsRoot = `${request.constructsPath}/${folderApiName}`;
        const lambdasRoot = request.lambdasPath;
        const lambdasSharedRoot = `${lambdasRoot}/${request.lambdasSharedPath}/${folderApiName}`;

        const builder = new TypescriptEjsTemplateBuilder({
            formatter: this.props.formatter ?? new NoopFormatter(),
        });

        // add cdk lambda functions interface
        const lambdaFunctions = builder.addSourceFile();
        GeneratorFileTemplates.addLambdaFunctionImport(lambdaFunctions);

        // loop all controllers
        for (const controller of Object.values(request.constructInfo.controllers)) {
            const functionsInterface = `I${pascalCase(controller.name)}Functions`;

            const operations: OperationDescriptor[] = [];

            // for each operation of controller
            for (const operation of Object.values(controller.operations)) {
                const lambdaHandlerPath = `${request.lambdaPrefix}${paramCase(operation.operationId)}`;

                // add lambda function to functions interface
                operations.push({
                    name: operation.operationId,
                    description: operation.description,
                });

                // add lambda handler
                const lambdaHandler = builder.addSourceFile();
                lambdaHandler.addImport({
                    from: 'aws-lambda',
                    namedExports: ['APIGatewayProxyEvent', 'APIGatewayProxyResult'],
                    typeOnly: true,
                });
                lambdaHandler.addBlock({
                    type: 'function-body',
                    functionType: 'constant',
                    name: 'controller',
                    returnType: 'APIGatewayProxyResult',
                    async: true,
                    asyncReturn: true,
                    parameters: [
                        {
                            name: 'event',
                            type: 'APIGatewayProxyEvent',
                        },
                    ],
                    body: 'return { statusCode: 200, body: "ok" }',
                });
                lambdaHandler.build(`${lambdasRoot}/${lambdaHandlerPath}/index.ts`);
            }

            GeneratorFileTemplates.addLambdasInterfaceConstruct(lambdaFunctions, {
                className: functionsInterface,
                description: controller.description,
                operations,
            });
        }

        lambdaFunctions.build(`${constructsRoot}/functions.ts`);

        return {
            spec: request.constructInfo.spec,
            outputs: CDKConstructGeneratorImpl.rawFilesToSourceFiles(builder.getSourceFiles()),
        };
    }
}
