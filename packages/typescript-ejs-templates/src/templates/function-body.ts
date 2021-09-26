import { CommentProps } from './comment';
import { FunctionInterfaceProps } from './functions-interface';

export interface FunctionBodyProps extends FunctionInterfaceProps, CommentProps {
    functionType: 'named' | 'constant' | 'member';
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
<% if(functionType === 'named' || functionType === 'member') { -%>
    <%- include('modifiers', localData) %> <% if(functionType === 'named') { %>function<% } -%> <%- name -%>
<% } -%>
<% if(functionType === 'constant') { -%>
const <%- name -%> = <%- include('modifiers', localData) -%>
<% } -%>
<%- include('function-parameters', localData) -%>
:<%- utils.wrapIf(localData.asyncReturn, 'Promise<', returnType, '>') -%> <% if(functionType === 'constant') { %>=><% } -%> {
    <%- body %>
}
`;
