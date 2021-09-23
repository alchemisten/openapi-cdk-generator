export interface LambdaConstructProps {
    className: string;
    operations: string[];
}

// language=ejs
export const template = `
import { Function } from '@aws-cdk/aws-lambda';

export interface I<%- className %> {
    <% for(const operationId of operations) { %>
    <%- operationId %>: Function;
    <% } %>
}
`;
