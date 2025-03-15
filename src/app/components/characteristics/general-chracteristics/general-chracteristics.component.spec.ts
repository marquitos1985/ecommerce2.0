import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralChracteristicsComponent } from './general-chracteristics.component';

describe('GeneralChracteristicsComponent', () => {
  let component: GeneralChracteristicsComponent;
  let fixture: ComponentFixture<GeneralChracteristicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneralChracteristicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralChracteristicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
