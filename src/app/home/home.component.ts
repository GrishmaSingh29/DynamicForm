import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { FormBuilder, ValidatorFn, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public formData:  any;
  public myForm: FormGroup = this.formBuilder.group({});
  public submitted: boolean = false;
  public submittedData: any;
  
  constructor(
    private httpClient: HttpClient,
    private formBuilder: FormBuilder
    ) { }
    
  ngOnInit(): void {
    this.httpClient
      .get('./assets/questionnarie.json')
      .subscribe((formData: any) => {
          this.formData = formData.item;
          this.createForm();
      });
  }

  createForm() {
    this.formData.forEach((field: any) => {
      this.checkType(field);
    });
    console.log(this.myForm);
  }

  dateValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const today = new Date().getTime();
  
      if(!(control && control.value)) {
        return null;
      }
      return new Date(control.value).getTime() > today 
        ? {'invalidDate': 'You cannot use future dates' } 
        : null;
    }
  }

  //boolean - required
  //choice - required
  //date - required and should not be more than today's date
  //string -  required and should have only alphabets
  checkType(field: any) {
    switch(field.type) {
      case 'boolean':   this.myForm.addControl(field.text, this.formBuilder.control('', Validators.required));
                        break;
      case 'choice':    this.myForm.addControl(field.text, this.formBuilder.control('', Validators.required));
                        break;
      case 'string':    this.myForm.addControl(field.text, this.formBuilder.control('', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]));
                        break;
      case 'date':      this.myForm.addControl(field.text, this.formBuilder.control('', [Validators.required, this.dateValidator().bind(this)]));
                        break;          
      default:          break;
    }
  }

  onSubmit(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this.submitted = true;
    this.submittedData = Object.entries(this.myForm.value);
  }

}
