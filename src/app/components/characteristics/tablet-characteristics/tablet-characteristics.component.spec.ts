import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabletCharacteristicsComponent } from './tablet-characteristics.component';

describe('TabletCharacteristicsComponent', () => {
  let component: TabletCharacteristicsComponent;
  let fixture: ComponentFixture<TabletCharacteristicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabletCharacteristicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabletCharacteristicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
