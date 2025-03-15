import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MouseCharacteristicsComponent } from './mouse-characteristics.component';

describe('MouseCharacteristicsComponent', () => {
  let component: MouseCharacteristicsComponent;
  let fixture: ComponentFixture<MouseCharacteristicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MouseCharacteristicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MouseCharacteristicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
