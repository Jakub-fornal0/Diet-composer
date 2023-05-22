import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  public setItemToSessionStorage(key: string, value: any): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  public getItemFromSessionStorage<T>(key: string): T | undefined {
    const dataFromStorage = sessionStorage.getItem(key);
    if (dataFromStorage) {
      return JSON.parse(dataFromStorage);
    }
    return undefined;
  }

  public removeItemFromSessionStorage(key: string): void {
    sessionStorage.removeItem(key);
  }

  public clearSessionStorage(): void {
    sessionStorage.clear();
  }
}
