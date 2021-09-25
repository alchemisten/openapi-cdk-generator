import { CommentProps } from './comment';
import { PropertiesInterfaceProps } from './properties-interface';

export interface ClassImplProps extends Partial<PropertiesInterfaceProps>, CommentProps {
    name: string;
    extendsClass?: string;
    implementsInterfaces?: string[];
    generics?: string;
}

// language=ejs
export const classImplTemplate = `
<%- include('comment', localData) -%>
export class <%- name %><% if(typeof generics !== 'undefined') { %><<%- generics %>><% } %>
<% if(typeof extendsClass !== 'undefined') { %>extends <%- extendsClass %><% } %>
<% if(typeof implementsInterfaces !== 'undefined') { %> implements <%- implementsInterfaces.join(', ') %><% } %> {
    <% if(typeof properties !== 'undefined') { %>
        <%- include('properties-interface', properties) %>
    <% } %>
}
`;
