import { Component } from '@angular/core';
import { Observable, debounce, exhaustMap, merge, mergeAll, of, timer, toArray } from 'rxjs';
import { ConfigForm } from './dynamicForm/interface';
import { activityForm, createRegistry } from './activity-form-builder.';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  questions$: Observable<ConfigForm>;

  constructor() {
     this.questions$ = of(activityForm({},null)); 

     
     
     JSON["changeValuesByKey"] = function (json, key, nextValue,  ignore:Array<string>=[]) {
      let recursive = function (json:any, previousValue:any, nextValue:any, ignore:any ) {
        let k = "";
        if (json instanceof Object) {
          for (k in json) {
            if (json.hasOwnProperty(k) && ignore.indexOf(k)<0) {
              recursive(json[k], previousValue, nextValue, ignore);
              if (k === key  ) {
                json[k] = nextValue
              }
            }
          }
        }

      }
      recursive(json, key, nextValue ,ignore);
      return json
    }


    JSON["deleteByValue"] = function (json:any, value:any,ignore:Array<string>=[]): Array<any> {
      let keys:any = [];
      let recursive = function (object:any, value:any, key:any, obj:any,ignore:any) {
        let k = "";
        if (object instanceof Object) {
          for (k in object) {
            if (object.hasOwnProperty(k) && ignore.indexOf(k)<0) {
              recursive(object[k], value, key + "." + k, object,ignore);
            }
          }
        } else {
          if (object === value) {
            object.delete(key.substring(1, key.length))
            // keys.push({ key: key.substring(1, key.length), value: object, object: obj });
          }
        }
      }
      recursive(json, value, "", json,ignore);
      return keys
    }

    

    JSON["json2flat"] = function (json,ignore:Array<string>=[]): Array<any> {
      let keys :any= [];
      let recursive = function (object:any, key:any,ignore:any) {
        let k = "";
        if (object instanceof Object) {
          for (k in object) {
            if (object.hasOwnProperty(k)&& ignore.indexOf(k)<0) {
              recursive(object[k], key + "." + k,ignore);
            }
          }
        } else {
          keys.push({ key: key.substring(1, key.length), value: object });
        }
      }
      recursive(json, "",ignore);
      return keys;
    };


    JSON["findByValue"] = function (json, value,ignore:Array<string>=[]): Array<any> {
      let keys:any = [];
      let recursive = function (object:any, value:any, key:any, obj:any,ignore:any) {
        let k = "";
        if (object instanceof Object) {
          for (k in object) {
            if (object.hasOwnProperty(k)&& ignore.indexOf(k)<0) {
              recursive(object[k], value, key + "." + k, object,ignore);
            }
          }
        } else {
          if (object === value) {
            keys.push({ key: key.substring(1, key.length), value: object, object: obj });
          }
        }
      }
      recursive(json, value, "", json,ignore);
      return keys
    }



    JSON["json2array"] = function (json,ignore:Array<string>=[]): Array<any> {
      let keys:any = [];
      let recursive = function (object:any, key:any,ignore:any) {
        let k = "";
        if (object instanceof Object) {
          for (k in object) {
            if (object.hasOwnProperty(k)&& ignore.indexOf(k)<0) {
              recursive(object[k], k,ignore);
            }
          }
        } else {
          keys.push({ key: key, value: object });
        }
      }
      recursive(json, "",ignore);
      return keys;
    };




     JSON["findByKeyAndValue"] =  function(json:any, keyFind:any, valueFind:any,ignore:Array<string>=[]):any  {
      let keys:any = [];
      let recursive = function (object:any, value:any, key:any, obj:any,ignore:any ):any  {
        let k:any  = "";
        if (object instanceof Object) {
           for (k in object) {
            if (object.hasOwnProperty(k) && ignore.indexOf(k)<0) {
              recursive(object[k], value, k, object,ignore);
            }
          }
        }
        if (key === keyFind && object == valueFind) {
          keys.push({ "key": key, value: object, object: obj  });
        }
      }
      recursive(json, keyFind, "", json,ignore);
      return keys
    }


    JSON["json2flatObj"] = function (data, ignore: Array<string> = []): JSON {
      var result :any= {};
      let recursive = function (cur:any, prop:any) {
        if (Object(cur) !== cur ||  ignore.indexOf(prop) < 0) {
          result[prop] = cur;
        } else if (Array.isArray(cur)) {
          for (var i = 0, l = cur.length; i < l; i++)
            recursive(cur[i], prop + "[" + i + "]");
          if (l == 0)
            result[prop] = [];
        } else {
          var isEmpty = true;
          for (var p in cur) {
            isEmpty = false;
            recursive(cur[p], prop ? prop + "." + p : p);
          }
          if (isEmpty && prop)
            result[prop] = {};
        }
      }
      recursive(data, "");
      return <JSON>result;
    }
   
  }

  onFormCreate(formGroup:FormGroup | FormArray ){
    formGroup.valueChanges.pipe(debounce(()=>timer(0,1000))).subscribe(
       value=>
          console.log(value)
    )
  }
}
