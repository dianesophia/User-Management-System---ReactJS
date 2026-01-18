import storage from "./storage";

export type TokenResponse = {
  accessToken: string;
  refreshToken: string;
};

export const persistToken = (token: TokenResponse, isLocal?: boolean) => {
  if(isLocal){
    storage.setValue('refresh-token', token.refreshToken);
    storage.setValue('token', token.accessToken);
  } else {
    storage.session.setValue('refresh-token', token.refreshToken);
    storage.session.setValue('token', token.accessToken);
  }
};

export const getToken = () => {
  const token = storage.session.getValue('token') || storage.getValue('token');
  const refresh_token = storage.session.getValue('refresh-token') || storage.getValue('refresh-token');

  return {
    token,
    refresh_token,
  }
};

export const clearStorageValues = () => {
  storage.session.reset();
  storage.reset();
};