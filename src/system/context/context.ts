import { createContext } from './create-context';
import { UnitOfWorkContext } from './unit-of-work-context';
import { UserInfo } from './user-info';

export const contexts = {
  userInfo: createContext<UserInfo>(),
  requestIdContext: createContext<string>(),
  unitOfWork: createContext<UnitOfWorkContext>(),
};
