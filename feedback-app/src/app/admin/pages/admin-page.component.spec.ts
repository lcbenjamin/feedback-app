import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { MaterialModule } from '../../material.module';
import { FeedbackService } from '../../services/feedback.service';
import { AdminPageComponent } from './admin-page.component';

describe('AdminPageComponent', () => {
  let component: AdminPageComponent;
  let fixture: ComponentFixture<AdminPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminPageComponent],
      imports: [MaterialModule],
      providers: [
        {
          provide: FeedbackService,
          useValue: {
            getFeedbacks: () => of([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});