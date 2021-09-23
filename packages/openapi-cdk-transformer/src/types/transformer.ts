import { NullableApiType, OpenApiSpecs, OpenAPIV2Spec, OpenAPIV3Spec } from './open-api';
import {ApiController, ApiResource} from './cdk';

export interface CDKConstructResult<V extends NullableApiType = 'none'> {
    spec: OpenApiSpecs[V];
    controllers: Record<string, ApiController<V>>;
    resources: Record<string, ApiResource<V>>;
}

export interface IOpenAPIToCDKConstructTransformer {
    transform<V extends NullableApiType>(apiDocument: OpenAPIV2Spec | OpenAPIV3Spec): Promise<CDKConstructResult<V>>;
}
