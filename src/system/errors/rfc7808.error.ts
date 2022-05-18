export abstract class RFC7808Error extends Error {
  status = 500;

  constructor(message: string, public details: any[] = []) {
    super(message);
  }
}
