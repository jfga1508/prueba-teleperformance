import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup,FormControl, Validators } from '@angular/forms';

import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public via = '';
  public via1 = '';
  public via2 = '';
  public via3 = '';
  public via4 = '';
  public complementos  = '';
  step1: FormGroup;
  step2: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {
  }

  ngOnInit() {
    this.step1 = this.formBuilder.group({
      NIT1: new FormControl({value: null}, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)])
    });
    this.step2 = this.formBuilder.group({
      NIT2: ['', Validators.required],
      tipoID: ['', Validators.required],
      ID: ['', Validators.required],
      nombreEmpresa: new FormControl({value: null, disabled: false}, Validators.required),
      nombre1: new FormControl({value: null, disabled: false}, Validators.required),
      nombre2: new FormControl({value: null, disabled: false}),
      apellido1: new FormControl({value: null, disabled: false}, Validators.required),
      apellido2: new FormControl({value: null, disabled: false}),
      email: ['', Validators.required],
      telefono: ['', Validators.required],
      via: ['', Validators.required],
      via1: ['', Validators.required],
      via2: [''],
      via3: ['', Validators.required],
      via4: [''],
      complementos: ['', Validators.required],
      direccion: ['', Validators.required],
      municipio: new FormControl({value: null, disabled: false}, Validators.required),
      msg_tel: [''],
      msg_email: ['']
    });

    this.step2.controls['tipoID'].valueChanges.subscribe((value) => {
      if(value === 'NIT' || value === 'Extranjera') {
        $('#nombres').hide();
        $('#empresa').show();
        this.step2.controls['nombre1'].disable();
        this.step2.controls['nombre2'].disable();
        this.step2.controls['apellido1'].disable();
        this.step2.controls['apellido2'].disable();
        this.step2.controls['nombreEmpresa'].enable();
      } else {
        $('#nombres').show();
        $('#empresa').hide();
        this.step2.controls['nombre1'].enable();
        this.step2.controls['nombre2'].enable();
        this.step2.controls['apellido1'].enable();
        this.step2.controls['apellido2'].enable();
        this.step2.controls['nombreEmpresa'].disable();
      }
    });

    this.step2.controls['via'].valueChanges.subscribe((value) => {
      this.via = this.step2.controls['via'].value + ' ';
    });

    this.step2.controls['via1'].valueChanges.subscribe((value) => {
      this.via1 = this.step2.controls['via1'].value + ' ';
    });

    this.step2.controls['via2'].valueChanges.subscribe((value) => {
      this.via2 = this.step2.controls['via2'].value + ' ';
    });

    this.step2.controls['via3'].valueChanges.subscribe((value) => {
      this.via3 = this.step2.controls['via3'].value + ' ';
    });

    this.step2.controls['via4'].valueChanges.subscribe((value) => {
      this.via4 = this.step2.controls['via4'].value + ' ';
    });

    this.step2.controls['complementos'].valueChanges.subscribe((value) => {
      this.complementos = this.step2.controls['complementos'].value;
    });
  }

  onSubmit1() {
    var nit = this.step1.controls['NIT1'].value;

    $('#alertMsg1').text('').hide();

    // stop here if form is invalid
    if (this.step1.invalid) {
      $('.ng-invalid').addClass('highlight');
      $('#alertMsg1').text('Por favor, ingresa todos los campos requeridos que esten en rojo.').fadeIn();
      return;
    }

    this.http.get<any>('/db/empresas/?nit=' + nit).subscribe(data => {
      if (data.length > 0 && data[0].restricted === false) {
        $('#infoMsg1').text(data[0].nombre + ' de la cuidad de ' + data[0].cuidad + ' esta registrada en la Camara de Comercio. NIT: ' + data[0].nit + ', direccion: '+ data[0].direccion).show();
        this.step2.patchValue({
          NIT2: nit
        });
        $('#step2').fadeIn();
        $('#step1').fadeOut();
      } else if (data.length > 0 && data[0].restricted === true) {
        $('#alertMsg1').text('Esta empresa no puede realizar el registro.').fadeIn();
      } else {
        $('#alertMsg1').text('No se encontro la empresa con este NIT.').fadeIn();
      }
    })
  }

  onSubmit2() {
    $('#alertMsg2').text('').hide();

    this.step2.patchValue({
      direccion: $('#direccion').val()
    });

    // stop here if form is invalid
    if (this.step2.invalid) {
      $('.ng-invalid').addClass('highlight');
      $('#alertMsg2').text('Por favor, ingresa todos los campos requeridos que esten en rojo.').fadeIn();
      return;
    }

    $('#successMsg2').text('El registro fue exitoso!').show();
    $('#step2Code').html(JSON.stringify(this.step2.value));

    /*this.http.patch('/db/registros', this.step2.value).subscribe(data => {
      
    })*/
  }

}
