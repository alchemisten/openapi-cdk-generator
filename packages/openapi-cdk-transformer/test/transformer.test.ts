import { getSpecData } from './utils';
import {
    CDKConstructResult,
    IOpenAPIParser,
    IOpenAPIToCDKConstructTransformer,
    OpenAPIParserImpl,
    OpenAPIParserResult,
    OpenAPIToCDKConstructTransformerImpl
} from '../src';

describe( 'OpenAPI Transformer', () => {
    const parser: IOpenAPIParser = new OpenAPIParserImpl();
    const transformer: IOpenAPIToCDKConstructTransformer = new OpenAPIToCDKConstructTransformerImpl();

    test( 'Transform v2', async () => {
        const v2Contents = getSpecData( 'PetstoreV2AsYaml' );

        const spec: OpenAPIParserResult = await parser.parse( v2Contents );
        const result: CDKConstructResult = await transformer.transform( spec );

        console.log( result );

    } );

    test( 'Transform v3', async () => {
        const v3Contents = getSpecData( 'PetstoreV3AsYaml' );

        const spec: OpenAPIParserResult = await parser.parse( v3Contents );
        const result: CDKConstructResult = await transformer.transform( spec );

    } );
} );