import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from '../../services/session-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private sessionStorageService: SessionStorageService) {
    this.sessionStorageService.clearSessionStorage();
  }

  public ngOnInit(): void {}
}
