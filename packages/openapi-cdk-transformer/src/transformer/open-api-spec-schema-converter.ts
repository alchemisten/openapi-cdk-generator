import {OpenAPIV3} from 'openapi-types';
import { JSONSchema4 } from 'json-schema';

export class OpenApiSpecSchemaConverter {

    constructor(private spec: OpenAPIV3.Document) {
    }

    createSchemaForOperation(operation: OpenAPIV3.OperationObject): JSONSchema4 {

        const properties: Record<string, JSONSchema4> = {};

        if(operation.requestBody) {
            const bodyReference = operation.requestBody as OpenAPIV3.ReferenceObject;

            if(bodyReference.$ref) {
                properties.body = this.resolveReferenceSchema(bodyReference);
            } else {
                const bodyRequestObject = operation.requestBody as OpenAPIV3.RequestBodyObject;
                properties.body = this.resolveRequestObjectSchema(bodyRequestObject);
            }
        }

        // TODO add schema objects for path and query parameters

        return {
            type: "object",
            properties
        }
    }

    resolveObjectSchema(schema: OpenAPIV3.SchemaObject): JSONSchema4 {
        const jsonSchema: JSONSchema4 = {
            type: schema.type
        };
        switch (schema.type) {
            case "object": {
                jsonSchema.properties = {};
                for(const prop in schema.properties) {
                    const property = schema.properties[prop];
                    const propertyRef = property as OpenAPIV3.ReferenceObject;
                    if(propertyRef.$ref) {
                        jsonSchema[prop] = this.resolveReferenceSchema(propertyRef);
                    } else {
                        jsonSchema[prop] = this.resolveObjectSchema(property as OpenAPIV3.SchemaObject);
                    }
                }
                break;
            }
            case "array": {
                const propertyRef = schema.items as OpenAPIV3.ReferenceObject;
                if(propertyRef.$ref) {
                    jsonSchema.items = this.resolveReferenceSchema(propertyRef);
                } else {
                    jsonSchema.items = this.resolveObjectSchema(schema.items as OpenAPIV3.SchemaObject);
                }
                break;
            }
        }

        return jsonSchema;
    }

    resolveReferenceSchema(reference: OpenAPIV3.ReferenceObject): JSONSchema4 {
        const [ location, root, container, model, ...rest ] = reference.$ref.split('\/');

        if(rest && rest.length > 0) {
            throw new Error(`Dont know how to parse the rest ${rest}`);
        }

        let document = this.spec;
        if(location !== '#') {
            throw new Error(`Ref other than # (${location}) is currently not supported!`);
        } else {
            // TODO overwrite document with maybe other document later
        }

        const rootKey = root as 'components';
        const rootObject: OpenAPIV3.ComponentsObject | undefined = document[rootKey];
        if(rootKey !== 'components' || !rootObject) {
            throw new Error(`Either root key ${rootKey} is undefined or not supported`);
        }

        const containerKey = container as keyof OpenAPIV3.ComponentsObject;
        if(containerKey !== 'schemas') {
            throw new Error(`Only schemas is currently supported (used ${containerKey})`);
        }
        const containerObject = rootObject[containerKey];
        if(!containerObject) {
            throw new Error(`Container key of ${containerKey} is not defined`);
        }

        const modelObject = containerObject[model];
        if(!modelObject) {
            throw new Error(`Reference ${reference.$ref} not found`);
        }

        const modelReference = modelObject as OpenAPIV3.ReferenceObject;
        if(modelReference.$ref) {
            console.warn(`${reference.$ref} directly points to ${modelReference.$ref}!`);
            return this.resolveReferenceSchema(modelReference);
        }

        return this.resolveObjectSchema(modelObject as OpenAPIV3.SchemaObject);
    }

    resolveRequestObjectSchema(request: OpenAPIV3.RequestBodyObject): JSONSchema4 {
        let jsonRequestContent = request.content['application/json'];

        if(!jsonRequestContent) {
            const keys = Object.keys(request.content);
            if(keys.length === 0) {
                throw new Error('No content type is defined!');
            }
            jsonRequestContent = request.content[keys[0]];
        }

        if(jsonRequestContent.schema) {
            const propertyRef = jsonRequestContent.schema as OpenAPIV3.ReferenceObject;
            if(propertyRef.$ref) {
                return this.resolveReferenceSchema(propertyRef);
            } else {
                return this.resolveObjectSchema(jsonRequestContent.schema as OpenAPIV3.SchemaObject);
            }
        }
        return {

        }
    }
}