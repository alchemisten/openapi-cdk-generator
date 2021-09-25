export interface FunctionParametersProps {
    parameters: FunctionParameter[];
}

export interface FunctionParameter {
    name: string;
    type: string;
    optional?: boolean;
}

// language=ejs
export const functionParametersTemplate = `<% -%>
(<% for(let i = 0; i < parameters.length; i++) { const param = parameters[i]; -%>
<%- param.name %><%- param.optional ? '?' : '' -%>: <%- param.type -%><%- i !== parameters.length -1 ? ', ' : ' ' -%>
<% } -%>)<% -%>
`;
