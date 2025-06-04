import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepuestoComponent } from './repuesto.component';

describe('RepuestoComponent', () => {
  let component: RepuestoComponent;
  let fixture: ComponentFixture<RepuestoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepuestoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepuestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
