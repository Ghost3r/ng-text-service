import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigService } from './services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ng-text-service';
  private online: boolean = true;
  private onlineModeSubscription?: Subscription;

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.onlineModeSubscription = this.configService
      .isOnlineObservable()
      .subscribe((next: boolean) => {
        this.online = next;
      });
  }

  ngOnDestroy(): void {
    if (this.onlineModeSubscription) {
      this.onlineModeSubscription.unsubscribe();
    }
  }

  isOnline(): boolean {
    return this.online;
  }

  toggleOnline(): void {
    this.configService.setOnline(!this.online);
  }
}
