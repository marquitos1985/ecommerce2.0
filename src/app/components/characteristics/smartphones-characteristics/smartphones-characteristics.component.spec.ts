import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartphonesCharacteristicsComponent } from './smartphones-characteristics.component';

describe('SmartphonesCharacteristicsComponent', () => {
  let component: SmartphonesCharacteristicsComponent;
  let fixture: ComponentFixture<SmartphonesCharacteristicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SmartphonesCharacteristicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmartphonesCharacteristicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
