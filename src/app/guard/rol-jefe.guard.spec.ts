import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { rolJefeGuard } from './rol-jefe.guard';

describe('rolJefeGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => rolJefeGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
