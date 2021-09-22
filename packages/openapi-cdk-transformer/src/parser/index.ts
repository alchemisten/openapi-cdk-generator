import { OpenAPIV2, OpenAPIV3 } from 'openapi-types';

import yaml from 'yaml';
import { IOpenAPIParser, OpenAPIParserResult } from '../types';

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

        if (rawSpec.openapi) {
            return {
                version: rawSpec.openapi,
                majorVersion: 'v3',
                inputType,
                spec: rawSpec as OpenAPIV3.Document,
            };
        }
        if (rawSpec.swagger) {
            return {
                version: rawSpec.swagger,
                majorVersion: 'v2',
                inputType,
                spec: rawSpec as OpenAPIV2.Document,
            };
        }

        throw new Error('Unable to determine document Version');
    }
}
