export interface ModifiersProps {
    modifier?: 'public' | 'protected' | 'private';
    static?: boolean;
    readonly?: boolean;
    async?: boolean;
}

// language=ejs
export const modifierTemplate = `<% -%>
    <%- typeof modifier !== 'undefined' ? modifier : '' _%> 
    <%- typeof static !== 'undefined' ? 'static' : '' _%> 
    <%- typeof readonly !== 'undefined' ? 'readonly' : '' _%> 
    <%- typeof async !== 'undefined' ? 'async' : '' _%>
`;
