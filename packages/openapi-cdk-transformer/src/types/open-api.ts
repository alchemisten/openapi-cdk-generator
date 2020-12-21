import { OpenAPIV2, OpenAPIV3 } from 'openapi-types';

export type OpenAPIVersion = 'v2' | 'v3';
export type OpenAPIV2Spec = {
    majorVersion: 'v2';
    spec: OpenAPIV2.Document;
}

export type OpenAPIV3Spec = {
    majorVersion: 'v3';
    spec: OpenAPIV3.Document;
}

export type OpenAPISpec = OpenAPIV2Spec | OpenAPIV3Spec;

export type NullableApiType = OpenAPIVersion | 'none';
export type NoneApiType = { 'none': any; }

export type OpenAPITag = {
    'v2': OpenAPIV2.TagObject;
    'v3': OpenAPIV3.TagObject;
} & NoneApiType;

export type OpenApiPath = {
    'v2': OpenAPIV2.PathItemObject;
    'v3': OpenAPIV3.PathItemObject;
} & NoneApiType;

export type OpenApiOperation = {
    'v2': OpenAPIV2.OperationObject;
    'v3': OpenAPIV3.OperationObject;
} & NoneApiType;