#!/usr/bin/env node
import 'source-map-support/register';

import { App } from '@aws-cdk/core';
import { BasicStack } from './basic-stack';

const app = new App();
// eslint-disable-next-line no-new
new BasicStack(app, 'BasicStack');
