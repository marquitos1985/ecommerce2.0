import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeapphonesCharacteristicsComponent } from './heapphones-characteristics.component';

describe('HeapphonesCharacteristicsComponent', () => {
  let component: HeapphonesCharacteristicsComponent;
  let fixture: ComponentFixture<HeapphonesCharacteristicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeapphonesCharacteristicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeapphonesCharacteristicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
