import { readdir, readFile } from 'fs-extra';
import { createHash } from 'crypto';
import * as path from 'path';
import { GeneratedFilesMap } from './types';

export const calculateContentHash = (content: string): string => {
    const hash = createHash('sha256');
    hash.update(content);

    return hash.digest('hex');
};

export const normalizePath = (filePath: string): string => {
    return path.normalize(filePath).replace(/\\/g, '/');
};

// https://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
export async function* getFiles(dir: string, ignored: Readonly<string[]> = []): AsyncGenerator<string> {
    const directories = await readdir(dir, { withFileTypes: true });
    // eslint-disable-next-line no-restricted-syntax
    for (const directory of directories) {
        const res = path.resolve(dir, directory.name);
        if (directory.isDirectory()) {
            if (!ignored.includes(directory.name)) {
                yield* getFiles(res, ignored);
            }
        } else {
            yield normalizePath(res);
        }
    }
}

export const getRecursiveFileStats = async (
    folder: string,
    defaultAction?: 'noop' | 'delete',
    condition?: RegExp
): Promise<GeneratedFilesMap> => {
    const files: GeneratedFilesMap = {};

    for await (const filePath of getFiles(folder)) {
        if (condition ? condition.test(filePath) : true) {
            files[filePath] = {
                action: defaultAction ?? 'noop',
                oldHash: calculateContentHash(await readFile(filePath, { encoding: 'utf8' })),
            };
        }
    }

    return files;
};
