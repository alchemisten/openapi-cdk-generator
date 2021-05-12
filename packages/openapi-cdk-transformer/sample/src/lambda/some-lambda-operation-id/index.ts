import type { APIGatewayProxyHandler } from 'aws-lambda';
import { ISomeSampleTagDelegate } from '../shared/generated/delegate';

const delegate: ISomeSampleTagDelegate = /*MAGIC*/{ someLambdaOperationId: async () => ({ statusCode: 200, body: '' }) };

export const handler: APIGatewayProxyHandler = async (event) => {
    return await delegate.someLambdaOperationId(event);
}