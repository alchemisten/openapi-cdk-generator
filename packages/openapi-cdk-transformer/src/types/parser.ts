import { OpenAPIV2Spec, OpenAPIV3Spec } from "./open-api";

export type OpenAPIParserResult = {
    version: string;
    inputType: 'json' | 'yaml';
} & (OpenAPIV2Spec | OpenAPIV3Spec);

export interface IOpenAPIParser {
    parse(defString: string): Promise<OpenAPIParserResult>;
}