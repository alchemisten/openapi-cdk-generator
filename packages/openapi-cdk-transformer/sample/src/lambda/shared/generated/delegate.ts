import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export interface ISomeSampleTagDelegate {
    someLambdaOperationId(body: SomeMode, event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>; 
}