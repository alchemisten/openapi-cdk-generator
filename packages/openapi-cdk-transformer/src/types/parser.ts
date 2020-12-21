import { OpenAPISpec } from "./open-api";

export type OpenAPIParserResult = {
    version: string;
    inputType: 'json' | 'yaml';
} & OpenAPISpec;

export interface IOpenAPIParser {
    parse(defString: string): Promise<OpenAPIParserResult>;
}