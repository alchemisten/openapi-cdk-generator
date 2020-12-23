import * as ts           from 'typescript';
import { ModifierFlags } from 'typescript';

import * as path from 'path';

describe('Typescript generator', () => {
    test('Parse Typescript', () => {
        const file = path.resolve(__dirname, 'samples/sample-typescript.ts')
        const program = ts.createProgram({
            rootNames: [file],
            options: {

            }
        });

        const sourceFile = program.getSourceFile(file);
        const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

        if(sourceFile) {
            ts.forEachChild(sourceFile, node => {
                console.log(printer.printNode(ts.EmitHint.Unspecified, node, sourceFile));
            });
        }
    })

    test('Create source file', ( ) => {
        const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

        const source = ts.createSourceFile('output.ts', '', ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);

        const node = ts.factory.createClassDeclaration(
            undefined,
            undefined,
            'MyClass',
            undefined,
            undefined,
            [
                ts.factory.createMethodDeclaration(
                    undefined,
                    ts.factory.createModifiersFromModifierFlags(ModifierFlags.Private),
                    undefined,
                    'myMethod',
                    undefined,
                    undefined,
                    [
                        ts.factory.createParameterDeclaration(
                            undefined,
                            ts.factory.createModifiersFromModifierFlags(ModifierFlags.Readonly),
                            undefined,
                            'someParam',
                            undefined,
                            ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
                        )
                    ],
                    ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
                    ts.factory.createBlock([

                    ], true)
                )
            ]
        )

        const n = ts.factory.createNodeArray([node]);

        const done = ts.factory.updateSourceFile(source, n);

        const result = printer.printFile(done);

        console.log(result);
    })
});