import { Injectable } from '@angular/core';
import { storageKeys } from './storage-keys';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private savedData: any = {};

  public getSavedData() {
    this.savedData = {};
    Object.keys(storageKeys).forEach((key) => {
      if (key) {
        let data = JSON.parse(JSON.parse(this.get(storageKeys[key])));
        if (data) {
          this.savedData[storageKeys[key]] = data;
        }
      }
    });

    return this.savedData;
  }

  public set(key: string, data: any) {
    if (!data) {
      return;
    }
    return (
      key == storageKeys.filterByCategory || key == storageKeys.filterByModel
        ? sessionStorage
        : localStorage
    ).setItem(key, JSON.stringify(JSON.stringify(data)));
  }

  private get(key: string) {
    if (key !== null) {
      return (
        key == storageKeys.filterByCategory || key == storageKeys.filterByModel
          ? sessionStorage
          : localStorage
      ).getItem(key);
    }
  }

  public removeItem(key: string) {
    delete this.savedData[key];
    return (
      key == storageKeys.filterByCategory || key == storageKeys.filterByModel
        ? sessionStorage
        : localStorage
    ).removeItem(key);
  }

  private clearStorage() {
    localStorage.clear();
    sessionStorage.clear();
  }

  public clearStorageForLogout() {
    Object.keys(storageKeys).forEach((key) => {
      if (key && storageKeys[key] !== storageKeys.defaultLang) {
        this.removeItem(storageKeys[key]);
      }
    });
    this.savedData = {};
  }
}
