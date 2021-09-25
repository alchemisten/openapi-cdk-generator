import {
    BlocksProps,
    CommentProps,
    EjsTypescriptUtils,
    FunctionParametersProps,
    commentTemplate,
    functionParametersTemplate,
    blocksTemplate, functionsInterfaceTemplate, FunctionInterfacesProps,
} from "../src";

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

    test('Parameters', async () => {
        const props: FunctionParametersProps = {
            parameters: [
                {
                    name: 'firstParam',
                    type: 'string'
                },
                {
                    name: 'secondParam',
                    type: 'number',
                    optional: true
                }
            ]
        }

        const renderedParams = EjsTypescriptUtils.render(functionParametersTemplate, props);
        console.log(renderedParams);
    });

    test('Function Interface', async () => {
        const props: FunctionInterfacesProps = {
            functions: [
                {
                    name: 'foo',
                    returnType: 'number',
                    parameters: [
                        {
                            name: 'firstParam',
                            type: 'string'
                        },
                        {
                            name: 'secondParam',
                            type: 'number',
                            optional: true
                        }
                    ]
                }
            ]
        }

        const renderedFunctionInterface = EjsTypescriptUtils.render(functionsInterfaceTemplate, props);
        console.log(renderedFunctionInterface);
    });
})