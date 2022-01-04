import { TestBed } from '@angular/core/testing';

import { TransactionsGuard } from './transactions.guard';

describe('TransactionsGuard', () => {
  let guard: TransactionsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(TransactionsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
