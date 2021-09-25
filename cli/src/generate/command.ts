import { Command } from 'clipanion';
import { cosmiconfig } from 'cosmiconfig';
import { existsSync, readFile } from 'fs-extra';
import { create as createStore } from 'mem-fs';
import { create as createEditor } from 'mem-fs-editor';
import * as path from 'path';

import {
    CDKConstructGeneratorImpl,
    CDKConstructGeneratorResult,
    CDKConstructResult,
    IOpenAPIParser,
    IOpenAPIToCDKConstructTransformer,
    OpenAPIParserImpl,
    OpenAPIParserResult,
    OpenAPIToCDKConstructTransformerImpl,
} from 'openapi-cdk-transformer';
import { PrettierCodeFormatter } from 'typescript-ejs-templates';

import { BaseCommand } from '../command/base-command';
import { GenerateCommandConfig } from './types';

export class GenerateCommand extends BaseCommand {
    public constructor() {
        super();
    }

    @Command.String('--spec')
    protected specPath?: string;

    @Command.String('--name')
    protected name?: string;

    @Command.String('--lambdas')
    protected lambdasPath = 'src/lambdas/';

    @Command.String('--constructs')
    protected constructsPath = 'src/generated/';

    @Command.String('--lambda-prefix')
    protected lambdaPrefix = 'api-';

    @Command.Path('generate')
    public async execute(): Promise<number | void> {
        const { logger } = this;

        // load local config file
        const loader = cosmiconfig('openapi-cdk');
        const fileConfig = await loader.search();

        const cliConfig: Partial<Record<keyof GenerateCommandConfig, unknown>> = {
            specPath: this.specPath,
            name: this.name,
            lambdaPrefix: this.lambdaPrefix,
            lambdasPath: this.lambdasPath,
            constructsPath: this.constructsPath,
        };

        // clean undefined keys
        for (const key of Object.keys(cliConfig)) {
            if ((cliConfig as never)[key] === undefined) {
                delete (cliConfig as never)[key];
            }
        }

        // merge with file config
        const config: GenerateCommandConfig = {
            ...fileConfig?.config,
            ...cliConfig,
        };

        if (!config.specPath) {
            return logger.error('Spec (--spec, "specPath") path must be specified');
        }

        if (!config.name) {
            return logger.error('Name (--name, "name") for api must be defined!');
        }

        const absoluteSpecPath = path.resolve(process.cwd(), config.specPath);

        if (!existsSync(absoluteSpecPath)) {
            return logger.error(`Spec "${absoluteSpecPath}" does not exist.`);
        }

        logger.info(`Generating for "${absoluteSpecPath}"`);

        const parser: IOpenAPIParser = new OpenAPIParserImpl();
        const transformer: IOpenAPIToCDKConstructTransformer = new OpenAPIToCDKConstructTransformerImpl();
        const generator = new CDKConstructGeneratorImpl({
            formatter: PrettierCodeFormatter.fromLocalConfig(),
        });

        const spec: OpenAPIParserResult = await parser.parse(await readFile(absoluteSpecPath, { encoding: 'utf8' }));
        const constructs: CDKConstructResult = await transformer.transform(spec);

        const result: CDKConstructGeneratorResult = await generator.generate({
            apiName: config.name,
            constructInfo: constructs,
        });

        const editor = createEditor(createStore());
        for (const output of Object.values(result.outputs)) {
            logger.info(`  ->: ${output.filePath}`);
            const absoluteOutputPath = path.resolve(process.cwd(), output.filePath);
            editor.write(absoluteOutputPath, output.content);
        }

        await new Promise((resolve) => editor.commit(resolve));
    }
}
