import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TvCharacteristicsComponent } from './tv-characteristics.component';

describe('TvCharacteristicsComponent', () => {
  let component: TvCharacteristicsComponent;
  let fixture: ComponentFixture<TvCharacteristicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TvCharacteristicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TvCharacteristicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
