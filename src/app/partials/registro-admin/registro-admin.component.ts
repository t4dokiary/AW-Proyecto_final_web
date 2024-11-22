import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdministradoresService } from 'src/app/services/administradores.service';
declare var $:any;

@Component({
  selector: 'app-registro-admin',
  templateUrl: './registro-admin.component.html',
  styleUrls: ['./registro-admin.component.scss']
})
export class RegistroAdminComponent implements OnInit{
  @Input() rol: string = "";
  @Input() datos_user: any = {};

  //Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  public passwordIsValid: boolean = false;
  public confirmPasswordIsValid: boolean = false;

  public admin:any = {};
  public errors:any={};
  public editar:boolean = false;
  public token:string = "";

  constructor(
    private administradoresService: AdministradoresService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.admin = this.administradoresService.esquemaAdmin();

    //Definen el rol
    this.admin.rol = this.rol;

    console.log("Datos del admin: ", this.admin);

  }

  //Funciones para password
  showPassword()
  {
    if(this.inputType_1 == 'password'){
      this.inputType_1 = 'text';
      this.hide_1 = true;
    }
    else{
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }

  showPwdConfirmar()
  {
    if(this.inputType_2 == 'password'){
      this.inputType_2 = 'text';
      this.hide_2 = true;
    }
    else{
      this.inputType_2 = 'password';
      this.hide_2 = false;
    }
  }

  public regresar(){

  }

  public registrar(){
    //Validar
    this.errors = [];

    this.errors = this.administradoresService.validarAdmin(this.admin, this.editar);
    if(!$.isEmptyObject(this.errors)){
      return false;
    }

    //Validar la contraseña
    if(this.admin.password == this.admin.confirmar_password){
      //Entra a registrar el usuario administrador
      this.administradoresService.registrarAdmin(this.admin).subscribe(
        (response)=>{
          //Aquí va la ejecución del servicio si todo es correcto
          alert("Usuario registrado correctamente");
          console.log("Usuario registrado: ", response);
          if(this.token != ""){
            this.router.navigate(["home"]);
          }else{
            this.router.navigate(["/"]);
          }
        }, (error)=>{
          //Aquí se ejecuta el error
          alert("No se pudo registrar usuario");
        }
      );

    }else{
      alert("Las contraseñas no coinciden");
      this.admin.password="";
      this.admin.confirmar_password="";
    }
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
    this.passwordIsValid = this.admin.password?.length >= 8;
  }

  // Método para comprobar longitud de la confirmación de contraseña
  checkConfirmPasswordLength() {
    this.confirmPasswordIsValid = this.admin.confirmar_password?.length >= 8;
  }

  public actualizar(){

  }
}
