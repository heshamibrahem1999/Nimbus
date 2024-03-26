import { TestBed } from '@angular/core/testing';

import { IpServerService } from './ip-server.service';

describe('IpServerService', () => {
  let service: IpServerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IpServerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
