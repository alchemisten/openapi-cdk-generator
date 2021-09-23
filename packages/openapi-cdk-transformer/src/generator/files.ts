import ejs from 'ejs';

import * as lambdaConstruct from './templates/lambda-construct';

export abstract class GeneratorFileTemplates {
    public static lambdaConstruct(props: lambdaConstruct.LambdaConstructProps): string {
        return ejs.render(lambdaConstruct.template, props);
    }
}
