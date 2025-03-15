import { TestBed } from '@angular/core/testing';

import { DiscountCouponService } from './discount-coupon.service';

describe('DiscountCouponService', () => {
  let service: DiscountCouponService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiscountCouponService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
