import { ICodeFormatter, NoopFormatter, TypescriptEjsTemplateBuilder } from 'typescript-ejs-templates';
import {
    CDKConstructGenerateProps,
    CDKConstructGeneratorResult,
    ICDKConstructGenerator,
    NullableApiType,
    SourceFile,
} from '../types';
import { GeneratorFileTemplates } from './files';

export interface CDKConstructGeneratorProps {
    formatter?: ICodeFormatter;
}

export class CDKConstructGeneratorImpl implements ICDKConstructGenerator {
    public constructor(protected props: CDKConstructGeneratorProps) {}

    public async generate<V extends NullableApiType>(
        request: CDKConstructGenerateProps<V>
    ): Promise<CDKConstructGeneratorResult<V>> {
        const builder = new TypescriptEjsTemplateBuilder({
            formatter: this.props.formatter ?? new NoopFormatter(),
        });

        GeneratorFileTemplates.addLambdasInterfaceConstruct(builder.addSourceFile(), {
            className: 'ISomeLambdaFunctions',
            operations: ['getMe', 'getThis', 'getThat'],
        }).build(`src/generated/functions.ts`);

        return {
            spec: request.constructInfo.spec,
            outputs: Object.entries(builder.getSourceFiles()).reduce<Record<string, SourceFile>>(
                (stack, [filePath, content]) => {
                    stack[filePath] = {
                        filePath,
                        content,
                    };
                    return stack;
                },
                {}
            ),
        };
    }
}
