import { TypeImportsProps } from './type-imports';

export interface LambdaConstructProps extends TypeImportsProps {
    className: string;
    operations: string[];
}

// language=ejs
export const lambdaConstructTemplate = `
<%- include('type-imports', imports) %>

export interface I<%- className %> {
    <% for(const operationId of operations) { %>
    <%- operationId %>: Function;
    <% } %>

    <%- include('function-interface', { name: "foo", parameters: [{name: 'foo', type: 'string'}, {name: 'bar', type: 'string'}], returnType: 'any' }) %>
}
`;
