import { ClassInterfaceProps } from './class-interface';
import { TypeImportsProps } from './type-imports';

export interface LambdaConstructTemplateProps extends TypeImportsProps {
    interfaceProps: ClassInterfaceProps;
}

// language=ejs
export const lambdaConstructTemplate = `
<%- include('type-imports', imports) %>

<%- include('class-interface', interfaceProps) %>
`;
