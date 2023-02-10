import { Knex } from 'knex';

type Callback = () => Promise<void>;
type CallbackType = 'commit' | 'rollback';

export type UnitOfWorkContext = {
  readonly wasAttached: () => boolean;
  readonly getTransaction: Knex.TransactionProvider;
  readonly registerCallback: (on: CallbackType, callback: Callback) => void;
  readonly getCallbacks: (purpose: CallbackType) => Callback[];
};

export function makeUnitOfWorkContext(
  getKnex: () => Knex,
  isolationLevel?: Knex.IsolationLevels
): UnitOfWorkContext {
  let wasAttached = false;

  const getTransaction = getKnex().transactionProvider({
    isolationLevel,
  });

  const callbacks: Record<CallbackType, Callback[]> = {
    commit: [],
    rollback: [],
  };

  return {
    wasAttached: () => wasAttached,
    getTransaction: () => {
      wasAttached = true;
      return getTransaction();
    },
    registerCallback(on, callback) {
      callbacks[on].push(callback);
    },
    getCallbacks: (purpose) => callbacks[purpose],
  };
}
