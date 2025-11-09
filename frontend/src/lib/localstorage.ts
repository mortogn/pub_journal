type LocalStorageKey = "authToken" | "userPreferences";

export const localstorageSet = (key: LocalStorageKey, value: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
};

export const localstorageGet = (key: LocalStorageKey) => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
};

export const localstorageRemove = (key: LocalStorageKey) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};
