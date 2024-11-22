import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { FacadeService } from 'src/app/services/facade.service';
import { Location } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-registro-alumnos',
  templateUrl: './registro-alumnos.component.html',
  styleUrls: ['./registro-alumnos.component.scss']
})
export class RegistroAlumnosComponent implements OnInit {
  @Input() rol: string = "";
  @Input() datos_user: any = {};
  //Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  public passwordIsValid: boolean = false;
  public confirmPasswordIsValid: boolean = false;

  public alumno: any = {};
  public token: string = "";
  public errors: any = {};
  public editar: boolean = false;
  public idUser: Number = 0;

  constructor(
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private facadeService: FacadeService,
    private alumnosService: AlumnosService,
    private location: Location,
  ) { }

  ngOnInit(): void {
    //El primer if valida si existe un parámetro en la URL
    if (this.activatedRoute.snapshot.params['id'] != undefined) {
      this.editar = true;
      //Asignamos a nuestra variable global el valor del ID que viene por la URL
      this.idUser = this.activatedRoute.snapshot.params['id'];
      console.log("ID User: ", this.idUser);
      //Al iniciar la vista asignamos los datos del user
      this.alumno = this.datos_user;
    } else {
      this.alumno = this.alumnosService.esquemaAlumno();
      this.alumno.rol = this.rol;
      this.token = this.facadeService.getSessionToken();
    }
    //Imprimir datos en consola
    console.log("Alumno: ", this.alumno);
  }

  public regresar() {
    this.location.back();
  }

  //Funciones para password
  showPassword() {
    if (this.inputType_1 == 'password') {
      this.inputType_1 = 'text';
      this.hide_1 = true;
    }
    else {
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }

  showPwdConfirmar() {
    if (this.inputType_2 == 'password') {
      this.inputType_2 = 'text';
      this.hide_2 = true;
    }
    else {
      this.inputType_2 = 'password';
      this.hide_2 = false;
    }
  }

  public registrar() {
    //Validar
    this.errors = [];

    this.errors = this.alumnosService.validarAlumno(this.alumno, this.editar);
    if (!$.isEmptyObject(this.errors)) {
      return false;
    }
    //Validar la contraseña
    if (this.alumno.password == this.alumno.confirmar_password) {
      //Aquí si todo es correcto vamos a registrar - aquí se manda a llamar al servicio
      this.alumnosService.registrarAlumno(this.alumno).subscribe(
        (response) => {
          // aqui va la ejecucion del servicio si todo es correcto
          alert("alumno registrado correctamente");
          console.log("Respuesta del servicio: ", response);
          if (this.token != "") {
            this.router.navigate(['home']);
          } else {
            this.router.navigate(['/']);
          }
        }, (error) => {
          alert("No se pudo registrar el alumno");
        }
      );
    } else {
      alert("Las contraseñas no coinciden");
      this.alumno.password = "";
      this.alumno.confirmar_password = "";
    }
  }

  public actualizar() {
    //Validación
    this.errors = [];

    this.errors = this.alumnosService.validarAlumno(this.alumno, this.editar);
    if(!$.isEmptyObject(this.errors)){
      return false;
    }
    console.log("Pasó la validación");

    this.alumnosService.editarAlumno(this.alumno).subscribe(
      (response)=>{
        alert("Administrador editado correctamente");
        console.log("Admin editado: ", response);
        //Si se editó, entonces mandar al home
        this.router.navigate(["home"]);
      }, (error)=>{
        alert("No se pudo editar el administrador");
      }
    );
  }

  //Función para detectar el cambio de fecha
  public changeFecha(event: any) {
    console.log(event);
    console.log(event.value.toISOString());

    this.alumno.fecha_nacimiento = event.value.toISOString().split("T")[0];
    console.log("Fecha: ", this.alumno.fecha_nacimiento);
  }

  public soloLetras(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    // Permitir solo letras (mayúsculas y minúsculas) y espacio
    if (
      !(charCode >= 65 && charCode <= 90) &&  // Letras mayúsculas
      !(charCode >= 97 && charCode <= 122) && // Letras minúsculas
      charCode !== 32                         // Espacio
    ) {
      event.preventDefault();
    }
  }

  public soloNumeros(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    // Permitir solo números (0-9)
    if (!(charCode >= 48 && charCode <= 57)) { // Números del 0 al 9
      event.preventDefault();
    }
  }

  // Método para comprobar longitud de la contraseña
  checkPasswordLength() {
    this.passwordIsValid = this.alumno.password?.length >= 8;
  }

  // Método para comprobar longitud de la confirmación de contraseña
  checkConfirmPasswordLength() {
    this.confirmPasswordIsValid = this.alumno.confirmar_password?.length >= 8;
  }

}
