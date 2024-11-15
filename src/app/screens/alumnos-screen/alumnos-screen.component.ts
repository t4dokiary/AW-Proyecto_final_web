import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FacadeService } from 'src/app/services/facade.service';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alumnos-screen',
  templateUrl: './alumnos-screen.component.html',
  styleUrls: ['./alumnos-screen.component.scss']
})
export class AlumnosScreenComponent implements OnInit{

  public name_user: string = "";
  public rol: string = "";
  public lista_alumno:any[] = [];

  constructor(
    private facadeService: FacadeService,
    private AlumnosService: AlumnosService,
  ){}

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();
    //Listar alumnos
    this.obtenerAlumnos();
  }

  public obtenerAlumnos(){
    this.AlumnosService.obtenerListaAlumnos().subscribe(
      (response) => {
        this.lista_alumno = response;
        console.log("Lista de alumnos: ", this.lista_alumno);
      },(error) => {
        alert("Error al obtener la lista de alumnos");
      }
    );
  }

  public goEditar(id: number){

  }

  public delete(id: number){

  }
}//final de la clase

//esto va fuera de la llave que cierra la clase
export interface DatosUsuario {
  id: number,
  id_matricula: number;
  first_name: string;
  last_name: string;
  email: string;
  fecha_nacimiento: string,
  curp: string,
  rfc: string,
  edad: string
  telefono: string,
  ocupacion: string,
}
