import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  public setItemToLocalStorage(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public getItemFromLocalStorage<T>(key: string): T | undefined {
    const dataFromStorage = localStorage.getItem(key);
    if (dataFromStorage) {
      return JSON.parse(dataFromStorage);
    }
    return undefined;
  }

  public removeItemFromLocalStorage(key: string): void {
    localStorage.removeItem(key);
  }
}
