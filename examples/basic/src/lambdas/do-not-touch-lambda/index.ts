import middy from '@middy/core';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const controller = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    return { statusCode: 200, body: 'ok' };
};

export const handler = middy(controller);
