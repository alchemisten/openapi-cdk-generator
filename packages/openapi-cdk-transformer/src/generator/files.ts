import ejs, { IncluderResult, Options } from 'ejs';

import { functionInterfaceTemplate } from './templates/function-interface';
import { LambdaConstructProps, lambdaConstructTemplate } from './templates/lambda-construct';
import { typeImportsTemplate } from './templates/type-imports';

export type SyncEjsOptions = Options & { async?: never | undefined };

export abstract class GeneratorFileTemplates {
    public static readonly defaultEjsOptions: SyncEjsOptions = {
        includer: GeneratorFileTemplates.ejsIncluder,
    };

    public static ejsIncluder(originalPath: string): IncluderResult {
        let template: string;
        switch (originalPath) {
            case 'type-imports':
                template = typeImportsTemplate;
                break;
            case 'function-interface':
                template = functionInterfaceTemplate;
                break;
            default:
                throw new Error(`Template ${originalPath} is not defined`);
        }

        return {
            template,
        };
    }

    public static lambdaConstruct(props: LambdaConstructProps): string {
        return ejs.render(lambdaConstructTemplate, props, GeneratorFileTemplates.defaultEjsOptions);
    }
}
