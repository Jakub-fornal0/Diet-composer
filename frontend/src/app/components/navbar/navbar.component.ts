import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LocalStorageConsts } from 'src/app/consts/localstorage-consts';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  public authListenerSubs?: Subscription;
  public userIsAuthenticated: boolean = true;
  public mobileMenuIsOpen: boolean = false;

  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.checkUserIsAuth();
  }

  public logout(): void {
    this.localStorageService.removeItemFromLocalStorage(
      LocalStorageConsts.TOKEN
    );
    window.location.reload();
  }

  private checkUserIsAuth(): void {
    this.userIsAuthenticated = this.authService.userIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuth) => {
        this.userIsAuthenticated = isAuth;
      });
  }
}
