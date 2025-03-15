import { TestBed } from '@angular/core/testing';
import { ProductcCharacteristicsService } from './product-characteristics.service';


describe('ProductCharacteristicsService', () => {
  let service: ProductcCharacteristicsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductcCharacteristicsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
