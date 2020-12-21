import { IOpenAPIParser, OpenAPIParserResult } from "../types";
import { OpenAPIV2, OpenAPIV3 }                from "openapi-types";

import yaml from 'yaml';

export class OpenAPIParserImpl implements IOpenAPIParser {
    async parse(defString: string): Promise<OpenAPIParserResult> {

        let inputType: 'json' | 'yaml' | undefined;
        let rawSpec: any;

        try {
            rawSpec = JSON.parse(defString);
            inputType = 'json';
        } catch (jsonParseException) {
            try {
                rawSpec = yaml.parse(defString);
                inputType = 'yaml';
            } catch(yamlParseException) {
                throw new Error('Check input, it was neither json, nor yaml');
            }
        }

        if(rawSpec.openapi) {
            return {
                version: rawSpec.openapi,
                majorVersion: 'v3',
                inputType,
                spec: rawSpec as OpenAPIV3.Document,
            }
        } else if(rawSpec.swagger) {
            return {
                version: rawSpec.swagger,
                majorVersion: 'v2',
                inputType,
                spec: rawSpec as OpenAPIV2.Document,
            }
        }

        throw new Error('Unable to determine document Version');
    }
}