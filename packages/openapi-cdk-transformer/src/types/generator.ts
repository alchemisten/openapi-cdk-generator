import { CDKConstructResult } from './transformer';
import { NullableApiType, OpenApiSpecs } from './open-api';

export interface CDKConstructGeneratorProps<V extends NullableApiType = 'none'> {
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
    generate<V extends NullableApiType>(
        request: CDKConstructGeneratorProps<V>
    ): Promise<CDKConstructGeneratorResult<V>>;
}
