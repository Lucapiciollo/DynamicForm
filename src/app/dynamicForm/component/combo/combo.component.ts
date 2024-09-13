/**
 * @author luca.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2022-03-29 19:47:50
 * @modify date 2022-03-29 19:47:50
 * @desc [description]
 */
import { AfterViewInit, Component, ElementRef, Injector } from '@angular/core';
import { BaseComponent } from '../bsae-component.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
@Component({
  selector: 'app-combo',
  templateUrl: './combo.component.html',
  styleUrls: ['../../dynamic-form.component.scss']
})
export class ComboComponent extends BaseComponent implements AfterViewInit{

  readonly separatorKeysCodes = [ENTER, COMMA] as const
  /************************************************************************************************************************************************************************ */



  /************************************************************************************************************************************************************************ */





  override toString(num: any): string {
    return String(num)
  }



  /************************************************************************************************************************************************************************ */

  checkIfSelected(option) {
    return this.selectedItems.findIndex(value => value.id === option.id) > -1
  }

  optionClicked(event: Event, item: any) {
    event.stopPropagation();
    // this.toggleSelection(item);
  }
  /************************************************************************************************************************************************************************ */

  toggleSelection(item: any, event) {
    if (event.checked) {
      this.selectedItems = [...this.selectedItems, item];
    } else {
      this.selectedItems = this.selectedItems.filter(f => f.id != item.id);
    }
  }

  /************************************************************************************************************************************************************************ */
  ngAfterViewInit(): void {
    if (this.control.formAction.multiple && this.control.formAction.autocomplete) {
      this.control.formAction.formControl.value?.map(m => {
        this.selectedItems = this.control?.formAction?.options.filter(f => f.id == m)
      })
      this.callOnhange();
    }
  }
  /************************************************************************************************************************************************************************ */

  constructor(protected override injector: Injector, protected override element: ElementRef) {
    super(injector, element);

  }
  /************************************************************************************************************************************************************************ */
  optionSelected(name: string, value: any) {
    if (!this.control.formAction.formControl.disabled) {
      let res = this.control.formAction?.options?.find(f => f?.id == value?.id);
      this.control.formAction.formControl.markAsDirty();
      this.control.formAction.formControl.markAsTouched();
      this.control.formAction.formControl.setValue(value?.id || value);
    }
  }


  /************************************************************************************************************************************************************************ */

  clearButton(filtercontrol) {
    this.selectedItems = [...[]];
    this.control.formAction.formControl.setValue(null);
    this.control.formAction.formControl.markAsDirty();
    this.control.formAction.formControl.markAsTouched();
    this.callOnhange();
    this.resetFilte()
  }

  /************************************************************************************************************************************************************************ */
  displayFn = (value) => {
    if (this.clonedOption) {
      if (this.control.formAction.multiple && this.control.formAction.autocomplete) {
        return ""; //(value && this.clonedOption) ? this.clonedOption?.filter(f => value.indexOf(f?.id)>-1).map(m=>m?.description).join("; ") : "";;
      } else
        return (value && this.clonedOption) ? this.clonedOption.find(f => f.id == value)?.description || "" : "";
    }
    return ""
  }
}
