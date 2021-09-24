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
}

// language=ejs
export const typeImportsTemplate = `
<% for(const imp of imports) { %>
import <%- (imp.starAs && imp.exportName) ? '* as' : '' %> <%- imp.singleImport || imp.exportName || '' %><%- (imp.singleImport && imp.namedExports) ? ',' : '' %>
    <% if(imp.namedExports) { %>
        { <%- imp.namedExports.join(', ') %> }
    <% } %>
<% if (imp.exportName || imp.namedExport || imp.singleImport) {%>from<% } %> '<%- imp.from %>';
<% } %>
`;
