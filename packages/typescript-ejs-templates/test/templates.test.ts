import {
    BlocksProps,
    CommentProps,
    ConstantsProps,
    EjsTypescriptUtils,
    FunctionParametersProps,
    FunctionInterfacesProps,
    FunctionBodyProps,
    commentTemplate,
    functionParametersTemplate,
    functionBodyTemplate,
    blocksTemplate,
    functionsInterfaceTemplate,
    constantsTemplate,
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

    test('Function Body', async () => {
        const props: FunctionBodyProps = {
            type: 'constant',
            body: 'return 1;',
            name: 'foo',
            returnType: 'number',
            comment: 'Hello',
            async: true,
            asyncReturn: true,
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

        const renderedFunctionBody = EjsTypescriptUtils.render(functionBodyTemplate, props);
        console.log(renderedFunctionBody);
    });

    test('Constant', async () => {
        const props: ConstantsProps = {
            constants: [
                {
                    name: 'FOO_BAR_BAZ',
                    export: true,
                    value: 'some_value',
                    asString: true
                },
                {
                    name: 'FOO_BAR_BAZ_SNACKS',
                    export: true,
                    value: 'some_value',
                    asString: true
                }
            ]
        }
        const renderedConstant = EjsTypescriptUtils.render(constantsTemplate, props);
        console.log(renderedConstant);
    });
})