import { BlocksProps } from './blocks';
import { TypeImportsProps } from './type-imports';

export interface SourceFileProps extends TypeImportsProps, BlocksProps {}

// language=ejs
export const sourceFileTemplate = `
<%- include('type-imports', imports) %>
<%- include('blocks', blocks) %>
`;
