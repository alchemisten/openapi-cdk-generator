import ejs, { IncluderResult, Options } from 'ejs';

import { functionsInterfaceTemplate } from './templates/functions-interface';
import { lambdaConstructTemplate, LambdaConstructTemplateProps } from './templates/lambda-construct';
import { modifierTemplate } from './templates/modifiers';
import { typeImportsTemplate } from './templates/type-imports';
import { classInterfaceTemplate } from './templates/class-interface';
import { propertiesInterfaceTemplate } from './templates/properties-interface';

export type SyncEjsOptions = Options & { async?: never | undefined };

export interface LambdaConstructProps {
    className: string;
    operations: string[];
}

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
            case 'modifiers':
                template = modifierTemplate;
                break;
            case 'properties-interface':
                template = propertiesInterfaceTemplate;
                break;
            case 'functions-interface':
                template = functionsInterfaceTemplate;
                break;
            case 'class-interface':
                template = classInterfaceTemplate;
                break;
            default:
                throw new Error(`Template ${originalPath} is not defined`);
        }

        return {
            template,
        };
    }

    public static renderEjs(template: string, data: unknown): string {
        // TODO refactor in util class
        const mixins = {
            wrapIf: (left: string, value: string, right: string, condition: boolean) => {
                if (condition) {
                    return `${left}${value}${right}`;
                }
                return value;
            },
        };

        return ejs.render(
            template,
            { ...mixins, ...(data as Record<string, unknown>) },
            GeneratorFileTemplates.defaultEjsOptions
        );
    }

    public static lambdaConstruct(props: LambdaConstructProps): string {
        const templateProps: LambdaConstructTemplateProps = {
            imports: [
                {
                    from: '@aws-cdk/aws-lambda',
                    namedExports: ['Function'],
                },
            ],
            interfaceProps: {
                name: props.className,
                properties: props.operations.map((operation) => ({
                    type: 'Function',
                    fieldName: operation,
                })),
                functions: [
                    {
                        name: 'myFancyFunction',
                        returnType: 'any',
                        static: true,
                        parameters: [
                            {
                                name: 'foo',
                                type: 'string',
                            },
                            {
                                name: 'foo',
                                type: 'string',
                                optional: true,
                            },
                        ],
                    },
                ],
            },
        };
        return GeneratorFileTemplates.renderEjs(lambdaConstructTemplate, templateProps);
    }
}
