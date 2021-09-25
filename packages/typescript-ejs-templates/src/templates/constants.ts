export interface ConstantsProps {
    constants: Constant[];
}

export interface Constant {
    export?: boolean;
    name: string;
    value: string;
    asString?: boolean;
}

// language=ejs
export const constantsTemplate = `
<% for(const constant of constants) { -%>
<% if(constant.export){ %>export<% } %> const <%- constant.name %> = <%- utils.wrapIf(constant.asString, "'", constant.value, "'") %>;
<% } -%>
`;
