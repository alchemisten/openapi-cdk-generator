import {
    TypescriptEjsTemplateBuilder,
    PrettierCodeFormatter,
    TypescriptEjsTemplateBuilderProps,
    ClassBuilder
} from '../src';

describe('Builder', () => {

    const defaultBuilderConfig: TypescriptEjsTemplateBuilderProps = {
        formatter: PrettierCodeFormatter.fromLocalConfig()
    }

    test('Simple Imports', async () => {
        const builder = new TypescriptEjsTemplateBuilder(defaultBuilderConfig);

        const sourceFileBuilder = builder
            .addSourceFile()
            .addImport({
                from: '@aws-cdk/aws-lambda',
                namedExports: ['Function']
            });

        sourceFileBuilder.build('test.ts');

        sourceFileBuilder.addImport({
            from: '@aws-cdk/aws-api-gateway',
            namedExports: ['IRestApi']
        })
        sourceFileBuilder.build('other-test.ts');

        const sourceFiles = builder.getSourceFiles();

        expect(sourceFiles['test.ts']).toContain('import { Function } from \'@aws-cdk/aws-lambda\';');
        expect(sourceFiles['other-test.ts']).toContain('import { Function } from \'@aws-cdk/aws-lambda\';');
        expect(sourceFiles['other-test.ts']).toContain('import { IRestApi } from \'@aws-cdk/aws-api-gateway\';');
    });

    test('Simple Class', async () => {
        const builder = new TypescriptEjsTemplateBuilder(defaultBuilderConfig);

        const sourceFileBuilder = builder
            .addSourceFile()

        sourceFileBuilder.addBlock(
            ClassBuilder.createClass('MyClazz')
                .setComment({comment: 'This is some class', jsDoc: true})
                .addMethod({
                    name: 'test',
                    returnType: 'void',
                    body: 'console.log(`Hello ${name}`)',
                    modifier: 'public',
                    async: true,
                    asyncReturn: true,
                    parameters: [{
                        name: 'name',
                        type: 'string'
                    }]
                })
                .build());

        sourceFileBuilder.build('clazz.ts');

        console.log(builder.getSourceFiles()['clazz.ts']);
    });
});