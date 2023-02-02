import { RFC7807Error } from './rfc7807.error';

export class FallbackError extends RFC7807Error {
  constructor(public error: any) {
    super(
      ['string', 'number'].includes(typeof error)
        ? String(error)
        : 'Unknown error'
    );
  }
}
