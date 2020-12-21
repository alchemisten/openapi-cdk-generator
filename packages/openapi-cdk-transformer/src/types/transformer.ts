import { OpenAPISpec }   from "./open-api";
import { ApiController } from "./cdk";

export interface CDKConstructResult {
    spec: OpenAPISpec;
    resources: Record<string, ApiController>;
}

export interface IOpenAPIToCDKConstructTransformer {
    transform(spec: OpenAPISpec): Promise<CDKConstructResult>;
}