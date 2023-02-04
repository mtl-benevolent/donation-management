import { AsyncLocalStorage } from 'node:async_hooks';

export interface GetContextValueFn<T> {
  (): T | undefined;
}

export function createContext<T>() {
  const asyncStorage = new AsyncLocalStorage<T>();

  return {
    getValue: () => asyncStorage.getStore(),
    withContext: <TFn extends (...params: any[]) => any>(
      value: T,
      fn: TFn
    ): TFn => {
      const wrapped: any = (...args: any[]): any => {
        return asyncStorage.run(value, () => fn.apply(undefined, args));
      };

      return wrapped;
    },
  };
}
