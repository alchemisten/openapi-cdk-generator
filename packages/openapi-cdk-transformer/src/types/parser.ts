import { OpenAPIV2, OpenAPIV3 } from 'openapi-types';
import { OpenAPIV2Spec, OpenAPIV3Spec } from './open-api';

export type OpenAPISchemaObject = OpenAPIV2.SchemaObject | OpenAPIV3.NonArraySchemaObject;

export interface RefPointerInfo {
    name: string;
    target: OpenAPISchemaObject;
}

export type OpenAPIParserResult = {
    version: string;
    inputType: 'json' | 'yaml';
    pointers: Record<string, RefPointerInfo>;
} & (OpenAPIV2Spec | OpenAPIV3Spec);

export interface IOpenAPIParser {
    parse(defString: string): Promise<OpenAPIParserResult>;
}
