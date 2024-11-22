import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MaestrosService } from 'src/app/services/maestros.service';
import { Location } from '@angular/common';
import { FacadeService } from 'src/app/services/facade.service';
declare var $: any;

@Component({
  selector: 'app-registro-maestros',
  templateUrl: './registro-maestros.component.html',
  styleUrls: ['./registro-maestros.component.scss']
})
export class RegistroMaestrosComponent implements OnInit {
  @Input() rol: string = "";
  @Input() datos_user: any = {};

  //Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  public passwordIsValid: boolean = false;
  public confirmPasswordIsValid: boolean = false;

  public maestro: any = {};
  public errors: any = {};
  public editar: boolean = false;
  public token: string = "";
  public idUser: Number = 0;

  //Para el select
  public areas: any[] = [
    { value: '1', viewValue: 'Desarrollo Web' },
    { value: '2', viewValue: 'Programación' },
    { value: '3', viewValue: 'Bases de datos' },
    { value: '4', viewValue: 'Redes' },
    { value: '5', viewValue: 'Matemáticas' },
  ];

  public materias: any[] = [
    { value: '1', nombre: 'Aplicaciones Web' },
    { value: '2', nombre: 'Programación 1' },
    { value: '3', nombre: 'Bases de datos' },
    { value: '4', nombre: 'Tecnologías Web' },
    { value: '5', nombre: 'Minería de datos' },
    { value: '6', nombre: 'Desarrollo móvil' },
    { value: '7', nombre: 'Estructuras de datos' },
    { value: '8', nombre: 'Administración de redes' },
    { value: '9', nombre: 'Ingeniería de Software' },
    { value: '10', nombre: 'Administración de S.O.' },
  ];

  constructor(
    private maestrosService: MaestrosService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private location: Location,
    private facadeService: FacadeService,
  ) { }

  ngOnInit(): void {
    //El primer if valida si existe un parámetro en la URL
    if (this.activatedRoute.snapshot.params['id'] != undefined) {
      this.editar = true;
      //Asignamos a nuestra variable global el valor del ID que viene por la URL
      this.idUser = this.activatedRoute.snapshot.params['id'];
      console.log("ID User: ", this.idUser);
      //Al iniciar la vista asignamos los datos del user
      this.maestro = this.datos_user;
    } else {
      this.maestro = this.maestrosService.esquemaMaestro();
      this.maestro.rol = this.rol;
      this.token = this.facadeService.getSessionToken();
    }
    //Imprimir datos en consola
    console.log("maestro: ", this.maestro);

  }

  public regresar() {
    this.location.back();
  }

  public registrar() {
    //Validar
    this.errors = [];

    this.errors = this.maestrosService.validarMaestro(this.maestro, this.editar);
    if (!$.isEmptyObject(this.errors)) {
      return false;
    }
    //Validar la contraseña
    if (this.maestro.password == this.maestro.confirmar_password) {
      //Entra a registrar el usuario administador
      this.maestrosService.registrarMaestro(this.maestro).subscribe(
        (response) => {
          // aqui va la ejecucion del servicio si todo es correcto
          alert("Maestro registrado correctamente");
          console.log("Respuesta del servicio: ", response);
          if (this.token != "") {
            this.router.navigate(['home']);
          } else {
            this.router.navigate(['/']);
          }
        }, (error) => {
          alert("No se pudo registrar el Maestro");
        }
      );
    } else {
      alert("Las contraseñas no coinciden");
      this.maestro.password = "";
      this.maestro.confirmar_password = "";
    }
  }

  public actualizar() {
    //Validación
    this.errors = [];

    this.errors = this.maestrosService.validarMaestro(this.maestro, this.editar);
    if(!$.isEmptyObject(this.errors)){
      return false;
    }
    console.log("Pasó la validación");

    this.maestrosService.editarMaestro(this.maestro).subscribe(
      (response)=>{
        alert("Maestro editado correctamente");
        console.log("Maestro editado: ", response);
        //Si se editó, entonces mandar al home
        this.router.navigate(["home"]);
      }, (error)=>{
        alert("No se pudo editar el maestro");
      }
    );
  }

  public checkboxChange2(event: any) {
    console.log("Evento: ", event);
    if (event.checked) {
      this.maestro.materias_json.push(event.source.value)
    } else {
      console.log(event.source.value);
      this.maestro.materias_json.forEach((materia, i) => {
        if (materia == event.source.value) {
          this.maestro.materias_json.splice(i, 1)
        }
      });
    }
    console.log("Array materias: ", this.maestro);
  }

  public checkboxChange(event: any): void {
    console.log("Evento: ", event);

    // Validar maestro.materias_json
    if (!this.maestro.materias_json) {
      this.maestro.materias_json = [];
    }

    if (event.checked) {
      this.maestro.materias_json.push(event.source.value);
    } else {
      console.log("Eliminar: ", event.source.value);
      this.maestro.materias_json = this.maestro.materias_json.filter(
        materia => materia !== event.source.value
      );
    }

    console.log("Array materias: ", this.maestro.materias_json);
  }



  public revisarSeleccion(nombre: string) {
    if (this.maestro.materias_json) {
      var busqueda = this.maestro.materias_json.find((element) => element == nombre);
      if (busqueda != undefined) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
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
  //Función para detectar el cambio de fecha
  public changeFecha(event: any) {
    console.log(event);
    console.log(event.value.toISOString());

    this.maestro.fecha_nacimiento = event.value.toISOString().split("T")[0];
    console.log("Fecha: ", this.maestro.fecha_nacimiento);
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
    this.passwordIsValid = this.maestro.password?.length >= 8;
  }

  // Método para comprobar longitud de la confirmación de contraseña
  checkConfirmPasswordLength() {
    this.confirmPasswordIsValid = this.maestro.confirmar_password?.length >= 8;
  }
}
