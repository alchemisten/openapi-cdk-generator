import { injectable } from 'inversify';
import { Foo, GetFooProps, ISampleController } from './controller';

@injectable()
export class SampleController implements ISampleController {
    public async getFoo(props: GetFooProps): Promise<Foo> {
        return {
            bar: props.params.some,
        };
    }
}
