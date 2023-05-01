import { STATUS_CODES } from 'node:http';

export type RFC7807Response = {
  type?: string;
  title: string;
  detail: string;
  status: number;
  stack?: string[];
} & { [key: string]: any };

/**
 * Class to conform to RFC7807 error format
 * @see https://www.rfc-editor.org/rfc/rfc7807
 */
export abstract class RFC7807Error extends Error {
  status = 500;

  constructor(message: string) {
    super(message);
  }

  serialize(safeError: boolean): RFC7807Response {
    return {
      status: this.status,
      title: this.getTitle(this.status),
      detail: this.message,
      stack: safeError ? undefined : (this.stack || '').split('\n'),
    };
  }

  protected getTitle(statusCode: number): string {
    return STATUS_CODES[statusCode] ?? 'Unknown error';
  }
}
