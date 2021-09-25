import { CommentProps } from './comment';
import { FunctionParametersProps } from './function-parameters';
import { ModifiersProps } from './modifiers';

export interface FunctionInterfacesProps {
    functions: FunctionInterfaceProps[];
}

export interface FunctionInterfaceProps extends FunctionParametersProps, ModifiersProps, CommentProps {
    name: string;
    returnType: string;
    asyncReturn?: boolean;
}

// language=ejs
export const functionsInterfaceTemplate = `
<% for(const func of functions) { _%>
    <%- include('comment', func) -%>
    <%- include('modifiers', func) %> <%- func.name -%><%- include('function-parameters', func) -%>
    :<%- utils.wrapIf(func.asyncReturn, 'Promise<', func.returnType, '>') -%>
<% } -%>
`;
