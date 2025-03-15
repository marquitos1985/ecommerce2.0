import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefrigeratorCharacteristicsComponent } from './refrigerator-characteristics.component';

describe('RefrigeratorCharacteristicsComponent', () => {
  let component: RefrigeratorCharacteristicsComponent;
  let fixture: ComponentFixture<RefrigeratorCharacteristicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RefrigeratorCharacteristicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefrigeratorCharacteristicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
