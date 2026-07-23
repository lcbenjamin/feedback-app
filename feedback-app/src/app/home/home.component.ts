import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FeedbackService } from '../services/feedback.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  readonly form = this.formBuilder.nonNullable.group({
    descricao: ['', [Validators.required, Validators.minLength(5)]],
    nota: [8, [Validators.required, Validators.min(0), Validators.max(10)]],
  });

  sending = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly feedbackService: FeedbackService,
    private readonly snackBar: MatSnackBar
  ) {}

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.sending = true;
    const { descricao, nota } = this.form.getRawValue();

    this.feedbackService.submitFeedback(descricao, nota).subscribe({
      next: () => {
        this.sending = false;
        this.snackBar.open('Feedback enviado com sucesso.', 'Fechar', { duration: 3500 });
        this.form.reset({ descricao: '', nota: 8 });
      },
      error: () => {
        this.sending = false;
      },
    });
  }
}