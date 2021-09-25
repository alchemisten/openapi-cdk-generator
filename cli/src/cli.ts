import { Cli } from 'clipanion';
import { readJsonSync } from 'fs-extra';
import { resolve } from 'path';
import { GenerateCommand } from './generate/command';

const [node, app, ...args] = process.argv;

const cli = new Cli({
    binaryLabel: 'OpenAPI CDK Generator - CLI',
    binaryName: `${node} ${app}`,
    binaryVersion: readJsonSync(resolve(__dirname, '../../package.json')).version,
});

cli.register(GenerateCommand);
cli.runExit(args, Cli.defaultContext).then();
