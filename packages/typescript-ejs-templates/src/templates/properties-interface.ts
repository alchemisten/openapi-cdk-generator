import { CommentProps } from './comment';
import { ModifiersProps } from './modifiers';

export interface PropertiesInterfaceProps {
    properties: PropertyInterface[];
}

export interface PropertyInterface extends ModifiersProps, CommentProps {
    asyncReturn?: boolean;
    fieldName: string;
    type: string;
}

// language=ejs
export const propertiesInterfaceTemplate = `
<% for(const property of properties) { -%>
    <%- include('comment', property) -%>
    <%- include('modifiers', property) %> <%- property.fieldName _%>:
    <%- utils.wrapIf(property.asyncReturn, 'Promise<', property.type, '>') _%>;
<% } -%>
`;
