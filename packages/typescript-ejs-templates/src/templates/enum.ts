export interface EnumProps {
    name: string;
    fields: EnumField[];
}

export interface EnumField {
    key: string;
    value?: string | number;
    asString?: boolean;
}

// language=ejs
export const enumTemplate = `
export enum <%- name %> {
<% for(const field of fields) { -%>
    <%- field.key %><% if(field.value) { %> = <%- utils.wrapIf(field.asString, "'", field.value, "'") %><% } %>,
<% } -%>
}
`;
