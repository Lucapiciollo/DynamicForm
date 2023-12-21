import { Component } from '@angular/core';
import { Observable, debounce, exhaustMap, merge, mergeAll, of, timer, toArray } from 'rxjs';
import { ConfigForm } from './dynamicForm/interface';
import { activityForm } from './activity-form-builder.';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  questions$: Observable<ConfigForm>;

  constructor() {
     this.questions$ = of(activityForm(null)); 
     
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



     JSON["findByKeyAndValue"] =  function(json:any, keyFind:any, valueFind:any,ignore:Array<string>=[]):any  {
      let keys:any = [];
      let recursive = function (object:any, value:any, key:any, obj:any,ignore:any):any  {
        let k:any  = "";
        if (object instanceof Object) {
          for (k in object) {
            if (object.hasOwnProperty(k) && ignore.indexOf(k)<0) {
              recursive(object[k], value, k, object,ignore);
            }
          }
        }
        if (key === keyFind && object == valueFind) {
          keys.push({ "key": key, value: object, object: obj });
        }
      }
      recursive(json, keyFind, "", json,ignore);
      return keys
    }

  }

  onFormCreate(formGroup:FormGroup | FormArray ){
    formGroup.valueChanges.pipe(debounce(()=>timer(0,1000))).subscribe(
       value=>
          console.log(value)
    )
  }
}
