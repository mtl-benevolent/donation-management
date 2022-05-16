import { appConfig } from './config';
import { bootstrapKoa } from './libs/koa/bootstrap';

bootstrapKoa(appConfig.koa);
