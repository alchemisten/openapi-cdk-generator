import { CDKConstructResult } from './transformer';
import { NullableApiType, OpenApiSpecs } from './open-api';

export interface CDKConstructGenerateProps<V extends NullableApiType = 'none'> {
    apiName: string;
    constructsPath: string;
    lambdasPath: string;
    lambdasSharedPath: string;
    lambdaPrefix: string;
    constructInfo: CDKConstructResult<V>;
}

export interface SourceFile {
    filePath: string;
    content: string;
}

export interface CDKConstructGeneratorResult<V extends NullableApiType = 'none'> {
    spec: OpenApiSpecs[V];
    outputs: Record<string, SourceFile>;
}

export interface ICDKConstructGenerator {
    generate<V extends NullableApiType>(request: CDKConstructGenerateProps<V>): Promise<CDKConstructGeneratorResult<V>>;
}
