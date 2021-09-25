import { ClassImplProps } from './class-impl';
import { ClassInterfaceProps } from './class-interface';

export interface ClassInterfaceBlock extends ClassInterfaceProps {
    type: 'class-interface';
}

export interface ClassImplBlock extends ClassImplProps {
    type: 'class-impl';
}

export type BlockType = ClassInterfaceBlock | ClassImplBlock;

export interface BlocksProps {
    blocks: BlockType[];
}

// language=ejs
export const blocksTemplate = `
<% for( const block of blocks ) { _%>
    <%- include(block.type, block) %>
<% } %>
`;
