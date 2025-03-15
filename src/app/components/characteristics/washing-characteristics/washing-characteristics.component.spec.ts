import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WashingCharacteristicsComponent } from './washing-characteristics.component';

describe('WashingCharacteristicsComponent', () => {
  let component: WashingCharacteristicsComponent;
  let fixture: ComponentFixture<WashingCharacteristicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WashingCharacteristicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WashingCharacteristicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
