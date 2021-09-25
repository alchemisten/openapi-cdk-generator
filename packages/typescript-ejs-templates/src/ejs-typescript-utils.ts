import ejs, { IncluderResult } from 'ejs';
import {
    blocksTemplate,
    classImplTemplate,
    classInterfaceTemplate,
    commentTemplate,
    functionsInterfaceTemplate,
    modifierTemplate,
    propertiesInterfaceTemplate,
    sourceFileTemplate,
    typeImportsTemplate,
} from './templates';

export abstract class EjsTypescriptUtils {
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
            case 'class-impl':
                template = classImplTemplate;
                break;
            case 'source-file':
                template = sourceFileTemplate;
                break;
            case 'comment':
                template = commentTemplate;
                break;
            case 'blocks':
                template = blocksTemplate;
                break;
            default:
                throw new Error(`Template ${originalPath} is not defined`);
        }

        return {
            template,
        };
    }

    public static wrapIf(condition: boolean, left: string, value: string, right: string) {
        if (condition) {
            return `${left}${value}${right}`;
        }
        return value;
    }

    public static render(template: string, data: unknown): string {
        const mixins = {
            utils: {
                wrapIf: EjsTypescriptUtils.wrapIf,
            },
        };

        return ejs.render(
            template,
            { ...mixins, ...(data as Record<string, unknown>) },
            {
                includer: EjsTypescriptUtils.ejsIncluder,
                localsName: 'localData',
            }
        );
    }
}
