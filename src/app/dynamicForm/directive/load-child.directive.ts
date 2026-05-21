/**
 * @format
 * @author luca.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2022-03-09 17:22:39
 * @modify date 2022-03-09 17:22:39
 * @desc [description]
 */

import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
   selector: '[loadChild]',
   standalone: false,
})
export class LoadChildDirective {
   constructor(public viewContainerRef: ViewContainerRef) {}
}
