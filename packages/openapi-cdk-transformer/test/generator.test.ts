import {PrettierCodeFormatter} from "typescript-ejs-templates";
import {
    CDKConstructGeneratorImpl, CDKConstructGeneratorResult,
    CDKConstructResult,
    IOpenAPIParser, IOpenAPIToCDKConstructTransformer,
    OpenAPIParserImpl,
    OpenAPIParserResult, OpenAPIToCDKConstructTransformerImpl
} from "../src";
import {getSpecData} from "./utils";

describe( 'Typescript generator', () => {
    const parser: IOpenAPIParser = new OpenAPIParserImpl();
    const transformer: IOpenAPIToCDKConstructTransformer = new OpenAPIToCDKConstructTransformerImpl();
    const generator = new CDKConstructGeneratorImpl({
        formatter: PrettierCodeFormatter.fromLocalConfig()
    });

    test('Simple Generator', async () => {


        const v3Contents = getSpecData( 'PetstoreV3AsYaml' );

        const spec: OpenAPIParserResult = await parser.parse( v3Contents );
        const constructs: CDKConstructResult = await transformer.transform( spec );

        const result: CDKConstructGeneratorResult = await generator.generate({
            apiName: 'PetStoreApi',
            constructInfo: constructs,
        });

        for(const output of Object.values(result.outputs)) {
            console.log(`File: "${output.filePath}"\n\n${output.content}`);
        }
    });
} );