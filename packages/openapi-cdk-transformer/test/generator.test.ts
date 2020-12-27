import * as ts from 'typescript';
import { SyntaxKind } from 'typescript';
import { format } from 'prettier';

import * as path from 'path';

// https://ts-ast-viewer.com/

describe( 'Typescript generator', () => {
    test( 'Parse Typescript', () => {
        const file = path.resolve( __dirname, 'samples/sample-typescript.ts' )
        const program = ts.createProgram( {
            rootNames: [ file ],
            options: {}
        } );

        const sourceFile = program.getSourceFile( file );
        const printer = ts.createPrinter( { newLine: ts.NewLineKind.LineFeed } );

        if ( sourceFile ) {
            ts.forEachChild( sourceFile, node => {
                console.log( printer.printNode( ts.EmitHint.Unspecified, node, sourceFile ) );
            } );
        }
    } )

    test( 'Create source file', () => {
        const { factory } = ts;

        const printer = ts.createPrinter( { newLine: ts.NewLineKind.LineFeed } );

        const importNode = factory.createImportDeclaration(
            undefined,
            undefined,
            factory.createImportClause(
                false,
                undefined,
                factory.createNamedImports([factory.createImportSpecifier(
                    undefined,
                    factory.createIdentifier("Construct")
                )])
            ),
            factory.createStringLiteral("@aws-cdk/core")
            );


        ts.addSyntheticLeadingComment(importNode, SyntaxKind.MultiLineCommentTrivia, 'Node ?', true);

        const source = ts.factory.createSourceFile(
            [
                importNode,
                factory.createClassDeclaration(
                    undefined,
                    undefined,
                    factory.createIdentifier("Snoot"),
                    undefined,
                    [factory.createHeritageClause(
                        ts.SyntaxKind.ExtendsKeyword,
                        [factory.createExpressionWithTypeArguments(
                            factory.createIdentifier("Construct"),
                            undefined
                        )]
                    )],
                    [
                        factory.createConstructorDeclaration(
                            undefined,
                            undefined,
                            [
                                factory.createParameterDeclaration(
                                    undefined,
                                    undefined,
                                    undefined,
                                    factory.createIdentifier("scope"),
                                    undefined,
                                    factory.createTypeReferenceNode(
                                        factory.createIdentifier("Construct"),
                                        undefined
                                    ),
                                    undefined
                                ),
                                factory.createParameterDeclaration(
                                    undefined,
                                    undefined,
                                    undefined,
                                    factory.createIdentifier("id"),
                                    undefined,
                                    factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
                                    undefined
                                )
                            ],
                            factory.createBlock(
                                [factory.createExpressionStatement(factory.createCallExpression(
                                    factory.createSuper(),
                                    undefined,
                                    [
                                        factory.createIdentifier("scope"),
                                        factory.createIdentifier("id")
                                    ]
                                ))],
                                true
                            )
                        ),
                        factory.createMethodDeclaration(
                            undefined,
                            [factory.createModifier(ts.SyntaxKind.AsyncKeyword)],
                            undefined,
                            factory.createIdentifier("snacks"),
                            undefined,
                            undefined,
                            [],
                            factory.createTypeReferenceNode(
                                factory.createIdentifier("Promise"),
                                [factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)]
                            ),
                            factory.createBlock(
                                [factory.createReturnStatement(factory.createNumericLiteral("0"))],
                                true
                            )
                        )
                    ]
                )
            ],
            ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
            ts.NodeFlags.None
        );

        const c = ts.factory.createJSDocComment('Skooby doo', [
        ]);

        console.log(printer.printNode(ts.EmitHint.Unspecified, c, source));

        const bundle = ts.factory.createBundle( [ source ] );

        const result = printer.printBundle( bundle );

        const formatted = format(result, {
            parser: 'typescript',
            singleQuote: true
        });

        console.log( formatted );
    } )
} );