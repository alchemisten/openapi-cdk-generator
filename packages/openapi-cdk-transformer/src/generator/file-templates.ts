import { ISourceFileBuilder } from 'typescript-ejs-templates';

export interface OperationDescriptor {
    name: string;
    description?: string;
}

export interface LambdaConstructProps {
    className: string;
    description?: string;
    operations: OperationDescriptor[];
}

export abstract class GeneratorFileTemplates {
    public static addLambdaFunctionImport(builder: ISourceFileBuilder): ISourceFileBuilder {
        builder.addImport({
            from: '@aws-cdk/aws-lambda',
            namedExports: ['IFunction'],
        });
        return builder;
    }

    public static addLambdasInterfaceConstruct(
        builder: ISourceFileBuilder,
        props: LambdaConstructProps
    ): ISourceFileBuilder {
        builder.addBlock({
            type: 'class-interface',
            name: props.className,
            comment: props.description,
            jsDoc: true,
            properties: props.operations.map((operation) => ({
                type: 'IFunction',
                fieldName: operation.name,
                comment: operation.description,
                jsDoc: true,
            })),
        });

        return builder;
    }
}
