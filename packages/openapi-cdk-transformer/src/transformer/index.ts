import { OpenAPIV2, OpenAPIV3 } from 'openapi-types';

import { camelCase, pascalCase } from 'change-case';
import {
    ApiController,
    ApiMethod,
    ApiResource,
    CDKConstructResult,
    IOpenAPIToCDKConstructTransformer,
    NullableApiType,
    OpenApiSpecs,
    OpenAPIV2Spec,
    OpenAPIV3Spec,
} from '../types';

export class OpenAPIToCDKConstructTransformerImpl implements IOpenAPIToCDKConstructTransformer {
    public async transform<V extends NullableApiType>(
        apiDocument: OpenAPIV2Spec | OpenAPIV3Spec
    ): Promise<CDKConstructResult<V>> {
        let resources: Record<string, ApiResource<V>> = {};
        if (apiDocument.majorVersion === 'v2') {
            resources = (await this.getV2Resources(apiDocument)) as Record<string, ApiResource<V>>;
        }

        if (apiDocument.majorVersion === 'v3') {
            resources = (await this.getV3Resources(apiDocument)) as Record<string, ApiResource<V>>;
        }

        const controllers = (apiDocument.spec.tags ?? []).reduce<Record<string, ApiController<V>>>((stack, tag) => {
            stack[tag.name] = {
                name: pascalCase(tag.name),
                description: tag.description ?? '',
                operations: {},
                tag: tag.name,
                spec: tag,
            };
            return stack;
        }, {});

        const stack = [...Object.values(resources)];
        let nextResource: ApiResource<V> | undefined;
        while ((nextResource = stack.pop())) {
            if (Object.keys(nextResource.operations).length > 0) {
                if (!controllers[nextResource.controller]) {
                    controllers[nextResource.controller] = {
                        name: pascalCase(nextResource.controller),
                        description: '',
                        tag: nextResource.controller,
                        spec: undefined,
                        operations: {},
                    };
                }

                controllers[nextResource.controller].operations = {
                    ...controllers[nextResource.controller].operations,
                    ...nextResource.operations,
                };
            }

            Object.values(nextResource.resources).forEach((res) => stack.push(res));
        }

        return {
            spec: apiDocument.spec as OpenApiSpecs[V],
            controllers,
        };
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
                controller: 'default',
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

                resource.controller =
                    operation.tags && operation.tags.length > 0 ? operation.tags[0] : resource.controller;

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
        const resources: Record<string, ApiResource<'v3'>> = {};

        const { paths } = apiDocument.spec;

        for (const apiPath of Object.keys(paths)) {
            const resource = this.createAndGetNestedResource(apiPath, resources);
            const pathItem = paths[apiPath] as OpenAPIV3.PathItemObject;

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { parameters, ...pathOperations } = pathItem;
            if (parameters) {
                console.warn('Parameters are defined, this feature is not implemented yet!', resource, parameters);
            }
            const operations = Object.entries(pathOperations).reduce<{ [key: string]: OpenAPIV3.OperationObject }>(
                (stack, [key, value]) => {
                    stack[key] = value;
                    return stack;
                },
                {}
            );

            for (const method of Object.keys(operations)) {
                const operation = operations[method];

                resource.controller =
                    operation.tags && operation.tags.length > 0 ? operation.tags[0] : resource.controller;

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
}
