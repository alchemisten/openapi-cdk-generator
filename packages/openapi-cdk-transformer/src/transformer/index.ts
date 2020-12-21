import {
    ApiMethod,
    ApiResource,
    CDKConstructResult,
    IOpenAPIToCDKConstructTransformer, NullableApiType,
    OpenAPIV2Spec, OpenAPIV3Spec
}                    from "../types";
import { OpenAPIV2 } from "openapi-types";

import { camelCase } from 'change-case';

export class OpenAPIToCDKConstructTransformerImpl implements IOpenAPIToCDKConstructTransformer {
    async transform<V extends NullableApiType>(apiDocument: OpenAPIV2Spec | OpenAPIV3Spec): Promise<CDKConstructResult<V>> {

        if (apiDocument.majorVersion === 'v2') {
            const spec = apiDocument;
            const resources = await this.getV2Resources(spec) as Record<string, ApiResource<V>>;
            return {
                spec,
                resources
            }
        }

        if (apiDocument.majorVersion === 'v3') {
            const spec = apiDocument;
            const resources = await this.getV3Resources(spec) as Record<string, ApiResource<V>>;
            return {
                spec,
                resources
            }
        }

        throw new Error(`Unsupported version`);
    }

    createAndGetNestedResource<V extends NullableApiType>(path: string, stack: Record<string, ApiResource<V>>): ApiResource<V> {
        const [rootResource, ...resourcePaths] = path.replace(/^\//, '').split('/');

        if (!rootResource) {
            throw new Error('No resource provided');
        }

        const createResource = (p: string): ApiResource<V> => {
            return {
                path: p,
                name: camelCase(p),
                operations: {},
                resources: {}
            }
        }

        if (!stack[rootResource]) {
            stack[rootResource] = createResource(rootResource);
        }

        let next;
        let currentResource = stack[rootResource];
        while (next = resourcePaths.shift()) {
            if (!currentResource.resources[next]) {
                currentResource.resources[next] = createResource(next);
            }

            currentResource = currentResource.resources[next];
        }

        return currentResource;
    }

    async getV2Resources(apiDocument: OpenAPIV2Spec): Promise<Record<string, ApiResource<'v2'>>> {

        const resources: Record<string, ApiResource<'v2'>> = {}

        const paths = apiDocument.spec.paths;

        for (const apiPath in paths) {
            if (!paths.hasOwnProperty(apiPath)) {
                continue;
            }

            const resource = this.createAndGetNestedResource(apiPath, resources);
            const pathItem: OpenAPIV2.PathItemObject = paths[apiPath];

            const { parameters, $ref, ...pathOperations } = pathItem;
            if (parameters) {
                console.warn("Parameters are defined, this feature is not implemented yet!", resource, parameters);
            }
            const operations = Object.entries(pathOperations)
                .reduce<{ [key: string]: OpenAPIV2.OperationObject }>((stack, [key, value]) => {
                    stack[key] = value;
                    return stack;
                }, {});

            for (const method in operations) {
                const operation = operations[method];

                let operationId = operation.operationId;
                if(!operationId) {
                    operationId = camelCase(`${apiPath} ${method} Operation`);
                    console.warn(`OperationId not defined on ${apiPath}:${method}, using generated id: ${operationId}`);
                }

                resource.operations[operationId] = {
                    method: method as ApiMethod,
                    operationId,
                    spec: operation,
                    description: operation.description || ''
                }
            }
        }

        return resources;
    }

    async getV3Resources(apiDocument: OpenAPIV3Spec): Promise<Record<string, ApiResource<'v3'>>> {
        throw 'not implemented';
    }
}