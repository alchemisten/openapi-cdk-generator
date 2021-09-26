import { ClassImplProps } from './class-impl';
import { ClassInterfaceProps } from './class-interface';
import { FunctionBodyProps } from './function-body';

export interface ClassInterfaceBlock extends ClassInterfaceProps {
    type: 'class-interface';
}

export interface ClassImplBlock extends ClassImplProps {
    type: 'class-impl';
}

export interface FunctionImplBlock extends FunctionBodyProps {
    type: 'function-body';
    functionType: 'named' | 'constant';
}

export type BlockType = ClassInterfaceBlock | ClassImplBlock | FunctionImplBlock;

export interface BlocksProps {
    blocks: BlockType[];
}

// language=ejs
export const blocksTemplate = `
<% for( const block of blocks ) { _%>
    <%- include(block.type, block) %>
<% } %>
`;
