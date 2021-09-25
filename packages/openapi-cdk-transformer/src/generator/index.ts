import {
    CDKConstructGenerateProps,
    CDKConstructGeneratorResult,
    ICDKConstructGenerator,
    NullableApiType,
} from '../types';
import { GeneratorFileTemplates } from './files';
import { ICodeFormatter } from './formatting';

export interface CDKConstructGeneratorProps {
    formatter?: ICodeFormatter;
}

export class CDKConstructGeneratorImpl implements ICDKConstructGenerator {
    public constructor(protected props: CDKConstructGeneratorProps) {}

    protected formatCode(code: string): string {
        if (this.props.formatter) {
            return this.props.formatter.format(code);
        }

        return code;
    }

    public async generate<V extends NullableApiType>(
        request: CDKConstructGenerateProps<V>
    ): Promise<CDKConstructGeneratorResult<V>> {
        return {
            spec: request.constructInfo.spec,
            outputs: {
                'functions.ts': {
                    filePath: 'functions.ts',
                    content: this.formatCode(
                        GeneratorFileTemplates.lambdaConstruct({
                            className: 'ISomeLambdaFunctions',
                            operations: ['getMe'],
                        })
                    ),
                },
            },
        };
    }
}
