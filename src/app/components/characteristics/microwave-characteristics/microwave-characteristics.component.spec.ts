import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MicrowaveCharacteristicsComponent } from './microwave-characteristics.component';

describe('MicrowaveCharacteristicsComponent', () => {
  let component: MicrowaveCharacteristicsComponent;
  let fixture: ComponentFixture<MicrowaveCharacteristicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MicrowaveCharacteristicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MicrowaveCharacteristicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
