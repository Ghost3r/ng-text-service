import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private online: boolean = true;
  private onlineMode = new BehaviorSubject<boolean>(true);

  constructor() {}

  getRestServiceUrl(): string {
    return environment.url;
  }

  setOnline(online: boolean) {
    this.online = online;
    this.onlineMode.next(this.online);
  }

  isOnline(): boolean {
    return this.online;
  }

  isOnlineObservable(): Observable<boolean> {
    return this.onlineMode.asObservable();
  }
}
