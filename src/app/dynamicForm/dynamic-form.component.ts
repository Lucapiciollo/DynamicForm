import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ConfigForm, TYPE_CONTROL_FORM } from './interface';
import { StepperService } from './dynamic-form.service';

@Component({
  styleUrls: ['./dynamic-form.component.css'],
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  providers: [StepperService]
})
export class DynamicFormComponent implements OnInit {
  @Input() questions!: ConfigForm | null;
  @Output() onFormCreate: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  
  public TYPE_CONTROL_FORM = TYPE_CONTROL_FORM;
  public formGroup!: FormGroup;
  private qcs: StepperService = inject(StepperService);

  constructor() { }

  ngOnInit() {
    this.formGroup = ((this.qcs.toFormGroup(this.questions as any) as FormArray).controls[0] as FormGroup);
    this.onFormCreate.emit(this.formGroup)
  }

  


}  
