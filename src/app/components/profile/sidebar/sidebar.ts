import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from "@angular/router";
import { APP_ROUTES } from '../../../config/app-routes.confg';
import { User } from '../../../auth/model/user';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
APP_Routes=APP_ROUTES;
@Input() user!: User | null ;
@Output() logout = new EventEmitter<void>();
@Output() sectionChange = new EventEmitter<'profile' | 'preferences' | 'help'>();

onLogoutClick() {
  this.logout.emit();
}

selectSection(section: 'profile' | 'preferences' | 'help') {
  this.sectionChange.emit(section);
}

}
