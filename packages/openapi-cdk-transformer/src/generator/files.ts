import { ISourceFileBuilder } from 'typescript-ejs-templates';

export interface LambdaConstructProps {
    className: string;
    operations: string[];
}

export abstract class GeneratorFileTemplates {
    public static addLambdasInterfaceConstruct(
        builder: ISourceFileBuilder,
        props: LambdaConstructProps
    ): ISourceFileBuilder {
        builder.addImport({
            from: '@aws-cdk/aws-lambda',
            namedExports: ['Function'],
        });

        builder.addBlock({
            type: 'class-interface',
            name: props.className,
            properties: props.operations.map((operation) => ({
                type: 'Function',
                fieldName: operation,
                comment: 'Hello World!',
            })),
        });

        return builder;
    }
}
