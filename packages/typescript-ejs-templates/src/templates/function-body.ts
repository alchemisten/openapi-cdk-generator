import { CommentProps } from './comment';
import { FunctionInterfaceProps } from './functions-interface';

export interface FunctionBodyProps extends FunctionInterfaceProps, CommentProps {
    type: 'named' | 'constant' | 'member';
    body: string;
}

/** named
 * async function foo(): Promise<any> {
 *    return 1;
 * }
 */

/** constant
 * const bob = async (): Promise<any> => {
 *    return 2;
 * }
 */

/** member
 * class Foo {
 *    public async foo(): Promise<any> {
 *       return 3;
 *    }
 * }
 */

// language=ejs
export const functionBodyTemplate = `
<%- include('comment', localData) -%>
<% if(type === 'named' || type === 'member') { -%>
    <%- include('modifiers', localData) %> <% if(type === 'named') { %>function<% } -%> <%- name -%>
<% } -%>
<% if(type === 'constant') { -%>
const <%- name -%> = <%- include('modifiers', localData) -%>
<% } -%>
<%- include('function-parameters', localData) -%>
:<%- utils.wrapIf(localData.asyncReturn, 'Promise<', returnType, '>') -%> <% if(type === 'constant') { %>=><% } -%> {
    <%- body %>
}
`;
