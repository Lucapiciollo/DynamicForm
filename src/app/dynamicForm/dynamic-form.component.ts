import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ConfigForm, TYPE_CONTROL_FORM } from './interface';
import { StepperService } from './dynamic-form.service';

@Component({
  styleUrls: ['./dynamic-form.component.scss'],
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  providers: [StepperService]
})
export class DynamicFormComponent {
  @Input() questions!: ConfigForm | null;
  @Output() onFormCreate: EventEmitter<FormGroup | FormArray> = new EventEmitter<FormGroup | FormArray>();
  private stepperService: StepperService = inject(StepperService);
  public TYPE_CONTROL_FORM = TYPE_CONTROL_FORM;
  public formGroup!: FormGroup | FormArray;


  constructor(private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    let fg = ((this.stepperService.toFormGroup(this.questions as any) as FormArray).controls as any);
    if (fg && fg.length == 1) {
      this.formGroup = fg[0];
    }
    if (fg && fg.length > 1) {
      this.formGroup = new FormArray([...fg]);
    }
    this.onFormCreate.emit(this.formGroup);



  }


  initializeForm() {
    this.ngOnInit()
  }

}  
