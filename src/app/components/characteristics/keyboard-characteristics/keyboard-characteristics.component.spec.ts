import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyboardCharacteristicsComponent } from './keyboard-characteristics.component';

describe('KeyboardCharacteristicsComponent', () => {
  let component: KeyboardCharacteristicsComponent;
  let fixture: ComponentFixture<KeyboardCharacteristicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KeyboardCharacteristicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KeyboardCharacteristicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
