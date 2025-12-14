import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { APP_ROUTES } from '../../../config/app-routes.confg';

@Component({
  selector: 'app-navbarlanding-page-component',
  imports: [RouterLink],
  templateUrl: './navbarlanding-page-component.html',
  styleUrl: './navbarlanding-page-component.css',
})
export class NavbarlandingPageComponent {
APP_ROUTES = APP_ROUTES;
}
