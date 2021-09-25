import { CommentProps } from './comment';
import { ModifiersProps } from './modifiers';

export interface FunctionsProps {
    functions: FunctionProps[];
}

export interface FunctionProps extends ModifiersProps, CommentProps {
    name: string;
    parameters: FunctionParameter[];
    returnType: string;
    asyncReturn?: boolean;
}

export interface FunctionParameter {
    name: string;
    type: string;
    optional?: boolean;
}

// language=ejs
export const functionsInterfaceTemplate = `
<% for(const func of functions) { _%>
    <%- include('comment', func) -%>
    <%- include('modifiers', func) %> <%- func.name %>(<% for(let i = 0; i < func.parameters.length; i++) { const param = func.parameters[i]; %>
        <%- param.name %><%- param.optional ? '?' : '' -%>: <%- param.type -%><%- i !== func.parameters.length -1 ? ', ' : ' ' -%>
        <% } %>
    ):  <%- utils.wrapIf(func.asyncReturn, 'Promise<', func.returnType, '>') %>
<% } _%>
`;
