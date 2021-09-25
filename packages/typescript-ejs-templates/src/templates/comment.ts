export interface CommentProps {
    jsDoc?: boolean;
    comment?: string;
}

// language=ejs
export const commentTemplate = `
<% if( typeof comment !== 'undefined') { const isJsDoc = typeof jsDoc !== 'undefined' && jsDoc === true; _%>
<% const delimiter = isJsDoc ? '*' : '//', content = comment.split('\\n') _%>
<% if(isJsDoc) { %>/**<% } %>
<% for( const commentLine of content) { _%>
<%- delimiter %> <%- commentLine %>
<% } _%>
<% if(isJsDoc) { %>*/
<% } -%>
<% } _%>
`;
