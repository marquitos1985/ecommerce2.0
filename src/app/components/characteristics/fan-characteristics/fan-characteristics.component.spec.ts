import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FanCharacteristicsComponent } from './fan-characteristics.component';

describe('FanCharacteristicsComponent', () => {
  let component: FanCharacteristicsComponent;
  let fixture: ComponentFixture<FanCharacteristicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FanCharacteristicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FanCharacteristicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
