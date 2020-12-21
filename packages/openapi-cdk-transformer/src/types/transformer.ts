import { NullableApiType, OpenApiSpecs, OpenAPIV2Spec, OpenAPIV3Spec, OpenAPIVersion } from "./open-api";
import { ApiController, ApiResource }                                                  from "./cdk";

export interface CDKConstructResult<V extends NullableApiType = 'none'> {
    spec: OpenApiSpecs[V];

    resources: Record<string, ApiResource<V>>;
}

export interface IOpenAPIToCDKConstructTransformer {
    transform<V extends NullableApiType>(apiDocument: OpenAPIV2Spec | OpenAPIV3Spec): Promise<CDKConstructResult<V>>;
}