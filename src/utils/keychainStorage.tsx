import * as Keychain from 'react-native-keychain';

const STORAGE_KEY = 'SecureStore';

const getStore = async (): Promise<Record<string, any>> => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials && credentials.username === STORAGE_KEY) {
      return JSON.parse(credentials.password);
    }
  } catch (e) {
    console.error('🔐 Error reading from Keychain:', e);
  }
  return {};
};

const saveStore = async (store: Record<string, any>) => {
  try {
    const serialized = JSON.stringify(store);
    await Keychain.setGenericPassword(STORAGE_KEY, serialized);
  } catch (e) {
    console.error('🔐 Error saving to Keychain:', e);
  }
};

export const setValue = async (key: string, value: any) => {
  const store = await getStore();
  store[key] = value;
  await saveStore(store);
};

export const getValue = async (key: string): Promise<any | null> => {
  const store = await getStore();
  return store.hasOwnProperty(key) ? store[key] : null;
};

export const removeValue = async (key: string) => {
  const store = await getStore();
  if (store.hasOwnProperty(key)) {
    delete store[key];
    await saveStore(store);
  }
};

export const clearAll = async () => {
  try {
    await Keychain.resetGenericPassword();
  } catch (e) {
    console.error('🔐 Error clearing Keychain:', e);
  }
};

export const storeUser = async (user: Record<string, any>) => {
  await setValue('user', user);
};

export const getUser = async (): Promise<Record<string, any> | null> => {
  return await getValue('user');
};
