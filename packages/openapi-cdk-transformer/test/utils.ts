import * as fs   from 'fs';
import * as path from 'path';

const samplesDir = path.resolve(__dirname,  './samples');

export const SampleSpecs = () => ({
    PetstoreV2AsYaml: 'petstore-v2.yaml',
    PetstoreV3AsYaml: 'petstore-v3.yaml',
});

const s = SampleSpecs();
export const getSpecData = (key: keyof ReturnType<typeof SampleSpecs>) => {
    return fs.readFileSync(path.resolve(samplesDir, s[key]), {encoding: 'utf8'});
}