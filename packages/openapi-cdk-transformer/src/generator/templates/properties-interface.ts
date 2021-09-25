import { ModifiersProps } from './modifiers';

export interface PropertiesInterfaceProps {
    properties: PropertyInterface[];
}

export interface PropertyInterface extends ModifiersProps {
    asyncReturn?: boolean;
    fieldName: string;
    type: string;
}

// language=ejs
export const propertiesInterfaceTemplate = `
    <% for(const property of properties) { %>
        <%- include('modifiers', property) %> <%- property.fieldName %>:
        <%- property.asyncReturn ? 'Promise<' : '' %><%- property.type %><%- property.asyncReturn ? '>' : '' %>;
    <% } %>
`;
