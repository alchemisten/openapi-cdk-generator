import { NullableApiType, OpenApiOperation, OpenApiPath, OpenAPITag } from "./open-api";
import { JSONSchema4 } from 'json-schema';

export type ApiMethod = 'get' | 'post' | 'patch' | 'put' | 'delete' | 'options';

export interface ApiResource<V extends NullableApiType = 'none'> {
    path: string;
    name: string;
    spec?: OpenApiPath[V];
    operations: Record<string, ApiOperation<V>>;
    resources: Record<string, ApiResource<V>>;
}

export interface ApiOperation<V extends NullableApiType = 'none'> {
    method: ApiMethod;
    operationId: string;
    spec?: OpenApiOperation[V];
    description: string;
    schema: JSONSchema4;
}

export interface ApiController<V extends NullableApiType = 'none'> {
    tag: string;
    name: string;
    description: string;
    spec?: OpenAPITag[V];
    resources: Record<string, ApiResource<V>>;
}