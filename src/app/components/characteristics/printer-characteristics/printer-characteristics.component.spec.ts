import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrinterCharacteristicsComponent } from './printer-characteristics.component';

describe('PrinterCharacteristicsComponent', () => {
  let component: PrinterCharacteristicsComponent;
  let fixture: ComponentFixture<PrinterCharacteristicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrinterCharacteristicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrinterCharacteristicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
