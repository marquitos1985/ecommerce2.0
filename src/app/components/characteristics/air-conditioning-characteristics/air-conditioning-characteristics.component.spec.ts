import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirConditioningCharacteristicsComponent } from './air-conditioning-characteristics.component';

describe('AirConditioningCharacteristicsComponent', () => {
  let component: AirConditioningCharacteristicsComponent;
  let fixture: ComponentFixture<AirConditioningCharacteristicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AirConditioningCharacteristicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AirConditioningCharacteristicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
