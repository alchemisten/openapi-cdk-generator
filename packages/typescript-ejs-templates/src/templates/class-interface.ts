import { CommentProps } from './comment';
import { FunctionsProps } from './functions-interface';
import { PropertiesInterfaceProps } from './properties-interface';

export interface ClassInterfaceProps extends Partial<PropertiesInterfaceProps>, Partial<FunctionsProps>, CommentProps {
    name: string;
    extendsInterfaces?: string[];
    generics?: string;
}

// language=ejs
export const classInterfaceTemplate = `
<%- include('comment', localData) -%>
export interface <%- name %><% if(typeof generics !== 'undefined') { %><<%- generics %>><% } %> <% if(typeof extendsInterfaces !== 'undefined') { %>extends <%- extendsInterfaces.join(', ') %><% } %> {
    <% if(typeof properties !== 'undefined') { %>
        <%- include('properties-interface', properties) %>
    <% } %>
    <% if(typeof functions !== 'undefined') { %>
        <%- include('functions-interface', functions) %>
    <% } %>
}
`;
