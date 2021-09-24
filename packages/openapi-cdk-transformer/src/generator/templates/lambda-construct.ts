export interface LambdaConstructProps {
    className: string;
    operations: string[];
}

// language=ejs
export const lambdaConstructTemplate = `
import { Function } from '@aws-cdk/aws-lambda';

export interface I<%- className %> {
    <% for(const operationId of operations) { %>
    <%- operationId %>: Function;
    <% } %>

    <%- include('function-interface', { name: "foo", parameters: [{name: 'foo', type: 'string'}, {name: 'bar', type: 'string'}], returnType: 'any' }) %>
}
`;
