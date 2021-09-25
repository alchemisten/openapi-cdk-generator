import { CommentProps } from './comment';
import { FunctionBodyProps } from './function-body';
import { PropertiesInterfaceProps } from './properties-interface';

export interface ClassImplProps extends Partial<PropertiesInterfaceProps>, CommentProps {
    name: string;
    extendsClass?: string;
    implementsInterfaces?: string[];
    generics?: string;
    methods?: MemberFunctionBodyProps[];
}

export interface MemberFunctionBodyProps extends FunctionBodyProps {
    type: 'member';
}

// language=ejs
export const classImplTemplate = `
<%- include('comment', localData) -%>
export class <%- name %><% if(typeof generics !== 'undefined') { %><<%- generics %>><% } %>
<% if(typeof extendsClass !== 'undefined') { %>extends <%- extendsClass %><% } %>
<% if(typeof implementsInterfaces !== 'undefined') { %> implements <%- implementsInterfaces.join(', ') %><% } %> {
    <% if(typeof properties !== 'undefined') { -%>
        <%- include('properties-interface', properties) %>
    <% } -%>
    <% if(typeof methods !== 'undefined') { -%>
        <% for(const method of methods) { -%>
            <%- include('function-body', method) %>
        <% } -%>
    <% } -%>
}
`;
