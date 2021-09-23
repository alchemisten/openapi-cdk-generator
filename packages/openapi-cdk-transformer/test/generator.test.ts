import {
    CDKConstructGeneratorImpl, CDKConstructGeneratorResult,
    CDKConstructResult,
    IOpenAPIParser, IOpenAPIToCDKConstructTransformer,
    OpenAPIParserImpl,
    OpenAPIParserResult, OpenAPIToCDKConstructTransformerImpl
} from "../src";
import {getSpecData} from "./utils";

import prettier from 'prettier';

describe( 'Typescript generator', () => {
    const parser: IOpenAPIParser = new OpenAPIParserImpl();
    const transformer: IOpenAPIToCDKConstructTransformer = new OpenAPIToCDKConstructTransformerImpl();
    const generator = new CDKConstructGeneratorImpl();

    test('Simple Generator', async () => {


        const v3Contents = getSpecData( 'PetstoreV3AsYaml' );

        const spec: OpenAPIParserResult = await parser.parse( v3Contents );
        const constructs: CDKConstructResult = await transformer.transform( spec );

        const result: CDKConstructGeneratorResult = await generator.generate({
            constructInfo: constructs
        });

        console.log(prettier.format(result.outputs['functions.ts'].content, {parser: 'babel-ts'}));
    });
} );