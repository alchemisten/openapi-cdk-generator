import { OpenAPIV2 } from 'openapi-types';

import { camelCase } from 'change-case';
import {
    ApiMethod,
    ApiResource,
    CDKConstructResult,
    IOpenAPIToCDKConstructTransformer,
    NullableApiType,
    OpenAPIV2Spec,
    OpenAPIV3Spec,
} from '../types';

export class OpenAPIToCDKConstructTransformerImpl implements IOpenAPIToCDKConstructTransformer {
    public async transform<V extends NullableApiType>(
        apiDocument: OpenAPIV2Spec | OpenAPIV3Spec
    ): Promise<CDKConstructResult<V>> {
        if (apiDocument.majorVersion === 'v2') {
            const spec = apiDocument;
            const resources = (await this.getV2Resources(spec)) as Record<string, ApiResource<V>>;
            return {
                spec,
                resources,
            } as never;
        }

        if (apiDocument.majorVersion === 'v3') {
            const spec = apiDocument;
            const resources = (await this.getV3Resources(spec)) as Record<string, ApiResource<V>>;
            return {
                spec,
                resources,
            } as never;
        }

        throw new Error(`Unsupported version`);
    }

    public createAndGetNestedResource<V extends NullableApiType>(
        path: string,
        stack: Record<string, ApiResource<V>>
    ): ApiResource<V> {
        const [rootResource, ...resourcePaths] = path.replace(/^\//, '').split('/');

        if (!rootResource) {
            throw new Error('No resource provided');
        }

        const createResource = (p: string): ApiResource<V> => {
            return {
                path: p,
                name: camelCase(p),
                operations: {},
                resources: {},
            };
        };

        if (!stack[rootResource]) {
            stack[rootResource] = createResource(rootResource);
        }

        let next;
        let currentResource = stack[rootResource];
        while ((next = resourcePaths.shift())) {
            if (!currentResource.resources[next]) {
                currentResource.resources[next] = createResource(next);
            }

            currentResource = currentResource.resources[next];
        }

        return currentResource;
    }

    public async getV2Resources(apiDocument: OpenAPIV2Spec): Promise<Record<string, ApiResource<'v2'>>> {
        const resources: Record<string, ApiResource<'v2'>> = {};

        const { paths } = apiDocument.spec;

        for (const apiPath of Object.keys(paths)) {
            const resource = this.createAndGetNestedResource(apiPath, resources);
            const pathItem: OpenAPIV2.PathItemObject = paths[apiPath];

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { parameters, $ref, ...pathOperations } = pathItem;
            if (parameters) {
                console.warn('Parameters are defined, this feature is not implemented yet!', resource, parameters);
            }
            const operations = Object.entries(pathOperations).reduce<{ [key: string]: OpenAPIV2.OperationObject }>(
                (stack, [key, value]) => {
                    stack[key] = value;
                    return stack;
                },
                {}
            );

            for (const method of Object.keys(operations)) {
                const operation = operations[method];

                let { operationId } = operation;
                if (!operationId) {
                    operationId = camelCase(`${apiPath} ${method} Operation`);
                    console.warn(`OperationId not defined on ${apiPath}:${method}, using generated id: ${operationId}`);
                }

                resource.operations[operationId] = {
                    method: method as ApiMethod,
                    operationId,
                    spec: operation,
                    description: operation.description || '',
                };
            }
        }

        return resources;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async getV3Resources(apiDocument: OpenAPIV3Spec): Promise<Record<string, ApiResource<'v3'>>> {
        throw new Error('not implemented');
    }
}
