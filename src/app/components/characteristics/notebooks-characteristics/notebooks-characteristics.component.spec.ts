import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotebooksCharacteristicsComponent } from './notebooks-characteristics.component';

describe('NotebooksCharacteristicsComponent', () => {
  let component: NotebooksCharacteristicsComponent;
  let fixture: ComponentFixture<NotebooksCharacteristicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotebooksCharacteristicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotebooksCharacteristicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
