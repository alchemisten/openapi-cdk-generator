import $RefParser from '@apidevtools/json-schema-ref-parser';
import { OpenAPIV2, OpenAPIV3 } from 'openapi-types';

import yaml from 'yaml';
import { IOpenAPIParser, OpenAPIParserResult, RefPointerInfo } from '../types';

type RefObject = OpenAPIV2.ReferenceObject | OpenAPIV3.ReferenceObject;

export class OpenAPIParserImpl implements IOpenAPIParser {
    public async parse(defString: string): Promise<OpenAPIParserResult> {
        let inputType: 'json' | 'yaml' | undefined;
        let rawSpec;

        try {
            rawSpec = JSON.parse(defString);
            inputType = 'json';
        } catch (jsonParseException) {
            try {
                rawSpec = yaml.parse(defString);
                inputType = 'yaml';
            } catch (yamlParseException) {
                throw new Error('Check input, it was neither json, nor yaml');
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rawSpec = (await $RefParser.bundle(rawSpec)) as any;

        const pointers: Record<string, RefPointerInfo> = {};

        const stack = [rawSpec];
        let current;
        while ((current = stack.pop())) {
            for (const value of Object.values(current)) {
                const possibleRef = value as RefObject;
                if (possibleRef.$ref) {
                    if (!/^#\//.test(possibleRef.$ref)) {
                        throw new Error(`Ref ${possibleRef.$ref} is not internal.`);
                    }

                    if (!pointers[possibleRef.$ref]) {
                        const objectPath = possibleRef.$ref.split(/(?:[/])+/);

                        if (objectPath.length === 0) {
                            throw new Error(`Ref ${possibleRef.$ref} could not be split`);
                        }

                        pointers[possibleRef.$ref] = {
                            name: objectPath[objectPath.length - 1],
                            target: objectPath.reduce((targetStack, nextKey, i) => {
                                if (nextKey === '#') {
                                    return targetStack;
                                }
                                if (!targetStack[nextKey]) {
                                    throw new Error(
                                        `Object path (${objectPath.join(
                                            ', '
                                        )})[${i}] does not contain ${nextKey} (available keys ${Object.keys(
                                            targetStack
                                        ).join(', ')})`
                                    );
                                }
                                return targetStack[nextKey];
                            }, rawSpec),
                        };
                    }

                    // pointers[possibleRef.$ref] = value;
                } else if (typeof value === 'object') {
                    for (const propValue of Object.values(value as Record<string, unknown>)) {
                        if (typeof propValue === 'object') {
                            stack.push(propValue);
                        }
                    }
                }
            }
        }

        if (rawSpec.openapi) {
            return {
                version: rawSpec.openapi,
                majorVersion: 'v3',
                inputType,
                spec: rawSpec as OpenAPIV3.Document,
                pointers,
            };
        }
        if (rawSpec.swagger) {
            return {
                version: rawSpec.swagger,
                majorVersion: 'v2',
                inputType,
                spec: rawSpec as OpenAPIV2.Document,
                pointers,
            };
        }

        throw new Error('Unable to determine document Version');
    }
}
