import { Command } from 'clipanion';
import { cosmiconfig } from 'cosmiconfig';
import { existsSync, readFile } from 'fs-extra';
import { create as createStore } from 'mem-fs';
import { create as createEditor } from 'mem-fs-editor';
import inquirer from 'inquirer';
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
import rimraf from 'rimraf';
import { PrettierCodeFormatter } from 'typescript-ejs-templates';

import { BaseCommand } from '../command/base-command';
import { ExistingFileStat, GenerateCommandConfig, GeneratedFilesMap, UpdateFileStat } from './types';
import { calculateContentHash, getRecursiveFileStats, normalizePath } from './utils';

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

    @Command.Boolean('--force')
    protected force = false;

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
        const config = {
            lambdaPrefix: 'api-',
            lambdasPath: 'src/lambdas/',
            constructsPath: 'src/generated/',
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

        const absoluteConstructsPath = path.resolve(process.cwd(), config.constructsPath);
        const absoluteLambdasPath = path.resolve(process.cwd(), config.lambdasPath);

        const existingLambdas = await getRecursiveFileStats(
            absoluteLambdasPath,
            'delete',
            new RegExp(`${config.lambdaPrefix}[^\\/]+/index\\.ts`)
        );

        const existingFiles: GeneratedFilesMap = {
            ...(await getRecursiveFileStats(absoluteConstructsPath, 'delete')),
            ...existingLambdas,
        };

        const editor = createEditor(createStore());
        for (const output of Object.values(result.outputs)) {
            const outputHash = calculateContentHash(output.content);
            const absoluteOutputPath = normalizePath(path.resolve(process.cwd(), output.filePath));
            editor.write(absoluteOutputPath, output.content);

            if (existingFiles[absoluteOutputPath]) {
                const existingFile = existingFiles[absoluteOutputPath];
                if ((existingFile as ExistingFileStat).oldHash !== outputHash) {
                    existingFile.action = 'update';
                    (existingFile as UpdateFileStat).newHash = outputHash;
                } else {
                    existingFile.action = 'noop';
                }
            } else {
                existingFiles[absoluteOutputPath] = {
                    action: 'create',
                    newHash: outputHash,
                };
            }
        }

        logger.info('Changes:\n');
        let changes = 0;
        for (const [filePath, info] of Object.entries(existingFiles)) {
            let color;
            switch (info.action) {
                case 'create':
                    color = 'green';
                    changes++;
                    break;
                case 'update':
                    color = 'orange';
                    changes++;
                    break;
                case 'delete':
                    color = 'red';
                    changes++;
                    editor.delete(filePath);
                    break;
                default:
                    color = 'cyan';
                    break;
            }

            logger.colorful(info.action, filePath, color);
        }

        if (changes > 0) {
            if (!this.force) {
                const { save } = await inquirer.prompt([
                    {
                        name: 'save',
                        message: 'Persist changes?',
                        type: 'confirm',
                        default: false,
                    },
                ]);

                if (!save) {
                    return logger.warn(`Abort by user, nothing saved`);
                }
            }

            await new Promise((resolve) => editor.commit(resolve));
            for (const [filePath, info] of Object.entries(existingLambdas)) {
                if (info.action === 'delete') {
                    await new Promise((resolve) => rimraf(path.dirname(filePath), resolve));
                }
            }
        } else {
            return logger.info(`Everything up to date, nothing to do`);
        }
    }
}
