import { appConfig } from './config';
import { bootstrapKnex, getKnex } from './libs/knex/bootstrap';
import { bootstrapKoa } from './libs/koa/bootstrap';

bootstrapKnex(appConfig.knex);
bootstrapKoa(appConfig.koa);
