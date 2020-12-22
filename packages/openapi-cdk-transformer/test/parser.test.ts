import { IOpenAPIParser, OpenAPIParserImpl, OpenAPIParserResult }                   from '../src';
import { getSpecData }                         from "./utils";


describe('OpenAPI parser', () => {
    const parser: IOpenAPIParser = new OpenAPIParserImpl();


    test('Parse v2', async () => {
        const v2Contents = getSpecData("PetstoreV2AsYaml");

        const result: OpenAPIParserResult = await parser.parse(v2Contents);

        expect(result.majorVersion).toBe('v2');
    });

    test('Parse v3', async () => {
        const v3Contents = getSpecData("PetstoreV3AsYaml");

        const result: OpenAPIParserResult = await parser.parse(v3Contents);

        expect(result.majorVersion).toBe('v3');
    });
})