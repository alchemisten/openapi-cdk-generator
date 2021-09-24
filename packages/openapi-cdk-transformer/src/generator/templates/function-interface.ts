export interface FunctionProps {
    name: string;
    parameters: FunctionParameter[];
    returnType: string;
}

export interface FunctionParameter {
    name: string;
    type: string;
    optional?: boolean;
}

// language=ejs
export const functionInterfaceTemplate = `
<%- name %>(<% for(let i = 0; i < parameters.length; i++) { const param = parameters[i]; %>
    <%- param.name %><%- param.optional ? '?' : '' -%>: <%- param.type -%><%- i !== parameters.length -1 ? ', ' : ' ' -%>
    <% } %>
): <%- returnType %>
`;
