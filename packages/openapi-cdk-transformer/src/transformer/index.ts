import { CDKConstructResult, IOpenAPIToCDKConstructTransformer, OpenAPISpec } from "../types";

export class OpenAPIToCDKConstructTransformerImpl implements IOpenAPIToCDKConstructTransformer{
    async transform(spec: OpenAPISpec): Promise<CDKConstructResult> {

        const resources = {};



        return {
            spec,
            resources
        }
    }
}