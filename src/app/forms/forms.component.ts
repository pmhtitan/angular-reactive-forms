import { Component, OnInit, ElementRef, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormBuilder, FormArray, Validators } from '@angular/forms';

import { ValidatePassword } from '../custom-validator/validate-password';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})
export class FormsComponent implements OnInit {

  public registroForm;
  public submitted = false;
  public provincias: any = ['Badajoz', 'Sevilla', 'Valladolid', 'Madrid', 'Barcelona', 'Teruel', 'Bilbao']

  constructor(private _formBuilder: FormBuilder, private detectorRef: ChangeDetectorRef) {
    this.registroForm = this._formBuilder.group({
      file: [null],
      fullName: this._formBuilder.group({
        nombre: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[_A-z0-9]*((-|\s)*[_A-z0-9]*$)')]],
        apellidos: ['', [Validators.required]]
      }),
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      telefono: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]+$')]],
      direccion: this._formBuilder.group({
        calle: ['', [Validators.required]],
        poblacion: ['', [Validators.required]],
        provincia: ['', [Validators.required]]
      }),
      genero: ['hombre'],
      PasswordValidation: this._formBuilder.group(
        {
          password: ['', Validators.required],
          confirmPassword: ['', Validators.required]
        },
        {
          validator: ValidatePassword.MatchPassword // tu método de validación
        }
      ),
      addDynamicElement: this._formBuilder.array([])
    });
   }

  ngOnInit() {
  }

 /*########################## File Upload ########################*/
 @ViewChild('fileInput') elementRef: ElementRef;
 public imageUrl: any = 'https://i.pinimg.com/236x/d6/27/d9/d627d9cda385317de4812a4f7bd922e9--man--iron-man.jpg';
 public editFile: boolean = true;
 public removeUpload: boolean = false;

 uploadFile(event) {
  let reader = new FileReader(); // HTML5 FileReader API
  let file = event.target.files[0];
  if (event.target.files && event.target.files[0]) {
    reader.readAsDataURL(file);

    // When file uploads set it to file formcontrol
    reader.onload = () => {
      this.imageUrl = reader.result;
      this.registroForm.patchValue({
        file: reader.result
      });
      this.editFile = false;
      this.removeUpload = true;
    }
    // ChangeDetectorRef since file is loading outside the zone
    this.detectorRef.markForCheck();        
  }
}

// Function to remove uploaded file
removeUploadedFile() {
  let newFileList = Array.from(this.elementRef.nativeElement.files);
  this.imageUrl = 'https://i.pinimg.com/236x/d6/27/d9/d627d9cda385317de4812a4f7bd922e9--man--iron-man.jpg';
  this.editFile = true;
  this.removeUpload = false;
  this.registroForm.patchValue({
    file: [null]
  });
}  

// getter method to access formControls
get myForm(){
  return this.registroForm.controls;
}

  /*############### Add Dynamic Elements ###############*/
get dynamicElement(){
  return this.registroForm.get('addDynamicElement') as FormArray;
}

// Elegir provincia usando un dropdown
changeProvincia(event){
  this.registroForm.get('direccion.provincia').setValue(event.target.value, {
    onlySelf: true
  });
}

// Array con Super Poderes
addSuperPowers(){
 this.dynamicElement.push(this._formBuilder.control(''));
}

onSubmit(){
  this.submitted = true;
  if(!this.registroForm.valid){
    alert("Por favor rellena todos los campos para ser un auténtico Super Hero!");
    return false;
  }else{
    console.log(this.registroForm.value);
  }
}

}
