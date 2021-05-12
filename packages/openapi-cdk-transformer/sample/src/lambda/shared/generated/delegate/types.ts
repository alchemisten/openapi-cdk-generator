import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";

export type ApiDelegateWrapper<ApiInterface> = {
    [method in keyof ApiInterface]: ApiInterface[method] extends (...args: any) => any
        ? (event: APIGatewayProxyEvent, ...params: Parameters<ApiInterface[method]>) => Promise<APIGatewayProxyResult>
        : never
}


