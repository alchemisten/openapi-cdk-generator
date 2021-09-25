import {BlocksProps, blocksTemplate, CommentProps, commentTemplate, EjsTypescriptUtils} from "../src";

describe('Templates', () => {
    test('Comment', async () => {
        const props: CommentProps = {
            jsDoc: true,
            comment: 'foo\nbar\nbaz'
        }

        const renderedComment = EjsTypescriptUtils.render(commentTemplate, props);

        console.log(renderedComment);
    });

    test('Block', async () => {
        const props: BlocksProps = {
            blocks: [
                {
                    type: 'class-interface',
                    name: 'MyInterface',
                    extendsInterfaces: ['Foo', 'Bar']
                },
                {
                    type: 'class-impl',
                    name: 'MyInterface',
                    extendsClass: 'Baz'
                }
            ]
        }

        const renderedBlock = EjsTypescriptUtils.render(blocksTemplate, props);
        console.log(renderedBlock);
    });
})