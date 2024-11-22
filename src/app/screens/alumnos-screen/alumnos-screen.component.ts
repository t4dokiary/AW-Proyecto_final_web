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
  public token: string = "";
  public lista_alumnos:any[] = [];

  // Para la tabla de alumnos
  displayedColumns: string[] = ['id_matricula', 'nombre', 'email', 'fecha_nacimiento', 'curp', 'telefono', 'actualizar', 'eliminar'];
  dataSource = new MatTableDataSource<DatosAlumnos>(this.lista_alumnos as DatosAlumnos[]);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private facadeService: FacadeService,
    private AlumnosService: AlumnosService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();
    this.obtenerAlumnos();
    this.initPaginator();
  }

  //Para paginación
  public initPaginator(){
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      //console.log("Paginator: ", this.dataSourceIngresos.paginator);
      //Modificar etiquetas del paginador a español
      this.paginator._intl.itemsPerPageLabel = 'Registros por página';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
          return `0 / ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} de ${length}`;
      };
      this.paginator._intl.firstPageLabel = 'Primera página';
      this.paginator._intl.lastPageLabel = 'Última página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Página siguiente';
    },500);
  }

  //Obtener alumnos
  public obtenerAlumnos(){
    this.AlumnosService.obtenerListaAlumnos().subscribe(
      (response) => {
        this.lista_alumnos = response;
        console.log("Lista de alumnos: ", this.lista_alumnos);
        if(this.lista_alumnos.length > 0){
          this.lista_alumnos.forEach((alumno) => {
            alumno.first_name = alumno.user.first_name;
            alumno.last_name = alumno.user.last_name;
            alumno.email = alumno.user.email;
          });
          console.log("Lista de alumnos: ", this.lista_alumnos);
          this.dataSource = new MatTableDataSource<DatosAlumnos>(this.lista_alumnos as DatosAlumnos[]);
        }
      },(error) => {
        alert("Error al obtener la lista de alumnos");
      }
    );
  }

  goEditarAlumno(idUser: number){
    this.router.navigate(["registro-usuarios/alumno/" + idUser]);
  }

  goEliminarAlumno(id: number){
    console.log("Eliminar alumno: ", id);
  }
}//final de la clase

//esto va fuera de la llave que cierra la clase
export interface DatosAlumnos {
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
}
