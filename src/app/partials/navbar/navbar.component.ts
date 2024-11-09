import { Component, Input, OnInit } from '@angular/core';
declare var $:any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() tipo: string = "";
  @Input() rol: string = "";

  public editar: boolean = false;
  public token: string = "";

  constructor() { }

  ngOnInit(): void {

  }

  public logout() {

  }
  public activarLink(link: string) {
    if (link == "alumnos") {
      $("#principal").removeClass("active");
      $("#maestro").removeClass("active");
      $("#alumno").addClass("active");
    } else if (link == "maestros") {
      $("#principal").removeClass("active");
      $("#alumno").removeClass("active");
      $("#maestro").addClass("active");
    } else if (link == "home") {
      $("#alumno").removeClass("active");
      $("#maestro").removeClass("active");
      $("#principal").addClass("active");
    } else if (link == "graficas") {
      $("#alumno").removeClass("active");
      $("#maestro").removeClass("active");
      $("#principal").removeClass("active");
      $("#graficas").addClass("active");
    }
  }
}
