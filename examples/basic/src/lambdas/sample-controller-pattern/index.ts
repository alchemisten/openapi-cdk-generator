import 'reflect-metadata';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as createHttpError from 'http-errors';
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import validator from '@middy/validator';
import Ajv from 'ajv';
import { container } from '../../shared/container';
import { GetFooParams, GetFooQuery, ISampleController, SampleControllerToken } from '../../shared/controller';

const ajv = new Ajv();

const inputSchema = ajv.compile({});

const outputSchema = ajv.compile({});

const delegate = container.get<ISampleController>(SampleControllerToken);

const controller = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const eventParams = event.pathParameters ?? {};
    const eventQuery = event.queryStringParameters ?? {};

    if (!eventParams.some) {
        throw new createHttpError.BadRequest('Parameter "some" must be defined');
    }

    const params: GetFooParams = {
        some: eventParams.some,
    };

    const query: GetFooQuery = {
        snacks: eventQuery.snacks,
    };

    const response = await delegate.getFoo({
        params,
        query,
    });

    return { statusCode: 200, body: JSON.stringify(response) };
};

export const handler = middy(controller)
    .use(
        validator({
            inputSchema,
            outputSchema,
        })
    )
    .use(httpErrorHandler());
