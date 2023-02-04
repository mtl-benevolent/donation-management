import { createContext } from './create-context';
import { UserInfo } from './user-info';

export const contexts = {
  userInfo: createContext<UserInfo>(),
  requestIdContext: createContext<string>(),
};
