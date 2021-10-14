import { Container } from 'inversify';
import { SampleControllerToken } from './controller';
import { SampleController } from './impl';

export const container = new Container();
container.bind(SampleControllerToken).to(SampleController);
