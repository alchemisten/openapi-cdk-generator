export interface TypeImportsProps {
    imports: TypeImportInfo[];
}

export type TypeImportInfo = {
    from: string;
} & (DefaultExport | NamedExport);

export interface DefaultExport {
    exportName: string;
    starAs: boolean;
}

export interface NamedExport {
    starAs?: undefined;
    singleImport?: string;
    namedExports?: string[];
    typeOnly?: boolean;
}

// language=ejs
export const typeImportsTemplate = `
<% for(const imp of imports) { _%>
import <% if(imp.typeOnly) { %>type<% } %> <%- (imp.starAs && imp.exportName) ? '* as' : '' %> <%- imp.singleImport || imp.exportName || '' %><%- (imp.singleImport && imp.namedExports) ? ',' : '' %>
    <% if(imp.namedExports) { %>
        { <%- imp.namedExports.join(', ') %> }
    <% } %>
<% if (imp.exportName || imp.namedExports || imp.singleImport) {%>from<% } %> '<%- imp.from %>';
<% } _%>
`;
