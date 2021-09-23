import {
    CDKConstructGeneratorProps,
    CDKConstructGeneratorResult,
    ICDKConstructGenerator,
    NullableApiType,
} from '../types';
import { GeneratorFileTemplates } from './files';

export class CDKConstructGeneratorImpl implements ICDKConstructGenerator {
    public async generate<V extends NullableApiType>(
        request: CDKConstructGeneratorProps<V>
    ): Promise<CDKConstructGeneratorResult<V>> {
        return {
            spec: request.constructInfo.spec,
            outputs: {
                'functions.ts': {
                    filePath: 'functions.ts',
                    content: GeneratorFileTemplates.lambdaConstruct({ className: 'TheClass', operations: ['getMe'] }),
                },
            },
        };
    }
}
