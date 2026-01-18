const storagePrefix = 'auth_service__';

type KnownKeyType = 
  | 'refresh-token'
  | 'token'
  | 'redirect-path'

type keyType = KnownKeyType | string;

const DEFAULT_EXPIRY_DURATION = 12 * 30 * 24 * 60 * 60 * 1000; 

const storage = {
  getValue: (key: keyType) => {
    const itemStr = window.localStorage.getItem(`${storagePrefix}${key}`);

    if(!itemStr) {
      return null;
    }

    const item = JSON.parse(itemStr);

    const now = Date.now();
    const timeInSeconds = now;

    if(timeInSeconds > item.expireIn) {
      storage.clearValue(key);
      return null;
    }

    return item.value;
  },

  setValue: (key: keyType, value: unknown, duration?: number) => {
    const now = Date.now();
    const timeInSeconds = now;

    const item = {
      value: value,
      expiresIn: timeInSeconds + (duration || DEFAULT_EXPIRY_DURATION),
    };
    window.localStorage.setItem(`${storagePrefix}${key}`, JSON.stringify(item));
  },

  clearValue: (key: keyType) => {
    window.localStorage.removeItem(`${storagePrefix}${key}`);
  },

  reset: () => {
    window.localStorage.clear();
  },

  session: {
    getValue: (key: keyType) => {
      const item = sessionStorage.getItem(`${storagePrefix}${key}`);
      return item ? JSON.parse(item) : null;
    },
    setValue: (key: keyType, value: unknown) => {
      sessionStorage.setItem(`${storagePrefix}${key}`, JSON.stringify(value));
    },
    clearValue: (key: keyType) => {
      sessionStorage.removeItem(`${storagePrefix}${key}`);
    },
    reset: () => {
      window.sessionStorage.clear();
    },
  }
};

export default storage;