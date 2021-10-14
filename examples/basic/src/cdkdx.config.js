module.exports = {
    lambdaTsConfig: (config) => {
        config.compilerOptions = {
            experimentalDecorators: true,
            emitDecoratorMetadata: true
        }
        if(!config.types) {
            config.types = [];
        }

        config.types.push('reflect-metadata');

        return config;
    }
}