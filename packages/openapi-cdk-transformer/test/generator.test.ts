import {
    createPrinter,
    createProgram,
    NewLineKind,
    createIncrementalProgram,
    forEachChild,
    EmitHint
} from 'typescript';

import * as path from 'path';

describe('Typescript generator', () => {
    const file = path.resolve(__dirname, 'samples/sample-typescript.ts')
    const program = createProgram({
        rootNames: [file],
        options: {

        }
    });

    const sourceFile = program.getSourceFile(file);
    const printer = createPrinter({ newLine: NewLineKind.LineFeed });

    forEachChild(sourceFile, node => {
        console.log(printer.printNode(EmitHint.Unspecified, node, sourceFile));
    });
});