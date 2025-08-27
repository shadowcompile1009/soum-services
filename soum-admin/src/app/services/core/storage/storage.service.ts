import { Injectable } from '@angular/core';
import { StorageKeys } from './storage-keys';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private savedData: any = {};

  constructor() { }

  public getSavedData() {
    Object.keys(StorageKeys).forEach(
      (key) => {
        if (key) {
          let data = JSON.parse(JSON.parse(this.get(StorageKeys[key])));
          if (data) {
            this.savedData[StorageKeys[key]] = data;
          }
        }
      }
    );

    return this.savedData;
  }

  public set(key: string, data: any) {
    if (!data) {
      return;
    }
    return localStorage.setItem(key, JSON.stringify(JSON.stringify(data)));
  }

  private get(key: string) {
    return localStorage.getItem(key);
  }

  public removeItem(key: string) {
    return localStorage.removeItem(key);
  }

  private clearStorage() {
    localStorage.clear();
  }

  public clearStorageForLogout() {
    return new Promise((resolve, reject) => {
      Object.keys(StorageKeys).forEach(
        (key) => {
          if (key !== StorageKeys.defaultLang) {
            this.removeItem(StorageKeys[key]);
          }
        }
      );
      this.savedData = {};
      resolve(this.savedData);
    });
  }
}
