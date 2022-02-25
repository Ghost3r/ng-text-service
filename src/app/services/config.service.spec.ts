import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { ConfigService } from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit value when calling setOnlineMode', fakeAsync(() => {
    let emitedValue = true;
    service.isOnlineObservable().subscribe((next: boolean) => {
      emitedValue = next;
    });

    expect(emitedValue).toBeTrue();
    expect(service.isOnline()).toBeTrue();

    service.setOnline(false);
    tick();
    expect(emitedValue).toBeFalse();
    expect(service.isOnline()).toBeFalse();
  }));
});
