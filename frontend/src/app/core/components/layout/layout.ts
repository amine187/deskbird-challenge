import { Component, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { Popover, PopoverModule } from 'primeng/popover';
import { Toolbar } from 'primeng/toolbar';
import { AuthService } from '../../../auth/services';

@Component({
  selector: 'app-layout',
  imports: [Toolbar, AvatarModule, ButtonModule, PopoverModule, RouterOutlet],
  templateUrl: './layout.html',
  standalone: true,
})
export class Layout {
  private authService = inject(AuthService);

  public user$ = this.authService.user;

  @ViewChild('op') op!: Popover;

  toggle(event: Event) {
    this.op.toggle(event);
  }

  logout() {
    this.authService.logout();
  }
}
