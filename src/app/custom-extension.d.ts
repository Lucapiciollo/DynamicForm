/**
 * @author @l.piciollo
 * @email l.piciollo@gmail.com
 * @create date 2019-12-22 12:09:07
 * @modify date 2019-12-22 12:09:07
 * @desc [interfaccia per la specializzazione di dunzionalita native dei browser
 * utile per risalire alle funzionalità messe a disposizione dal sistema core e evita che il compilatore vada in errore
 * per funzionalità non trovate.]
 */
declare function alert(message?: any, body?: any): void;

/************************************************************************************************************************************************************************ */

interface String {
  format: (...params: Array<string>) => string;
  isNullOrEmpty: (val: string) => boolean;
  truncateUrlIfNoParams: (val: any) => string;
  truncateUrlCache: (val: any) => string;
}

/************************************************************************************************************************************************************************ */

interface Array<T> {
  moveDown: (from: any) => void;
  moveTo: (from: number, to: number) => void;
  moveUp: (from: number) => void;
  delete: (position: number) => void;
  differences: (items: any) => Array<any>;
  inArray: (item: any) => Number;
  insert: (index: number, item: any) => void;
}

/************************************************************************************************************************************************************************ */

interface JSON {
  changeValues: (json: any, previousValue: any, nextValue: any, ignore?: Array<string>) => any;
  changeValuesByKey: (json: any, key: any, nextValue: any, ignore?: Array<string>) => any;
  findByValue: (json: any, value: any, ignore?: Array<string>) => any;
  json2flat: (json: any, ignore?: Array<string>) => any;
  json2array: (json: any, ignore?: Array<string>) => any;
  json2flatObj: (json: any, ignore?: Array<string>) => any;
  findKey: (json: any, keyFind: any, ignore?: Array<string>) => any;
  findByKeyAndValue: (json, keyFind, valueFind, ignore?: Array<string>) => any;
  deleteKey: <T>(json: T, keys: Array<string>) => T;
}

interface Object {
  PROXY: <T>(replaceWith: any, proxy: any, ignore: Array<string>) => T;
  clone: <T>() => T;
  changeValues: (previousValue: Array<any>, nextValue: any, ignore?: Array<string>) => any;
}
