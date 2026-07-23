import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { Feedback } from '../models/feedback.model';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  private readonly feedbacksSubject = new BehaviorSubject<Feedback[]>([
    { id: 1, descricao: 'Atendimento cordial e rápido.', nota: 9, data: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 2, descricao: 'Sugestão: melhorar a documentação.', nota: 7, data: new Date(Date.now() - 86400000).toISOString() },
    { id: 3, descricao: 'Fluxo muito intuitivo.', nota: 10, data: new Date().toISOString() },
  ]);

  constructor(private readonly http: HttpClient) {}

  getFeedbacks(): Observable<Feedback[]> {
    return this.feedbacksSubject.asObservable().pipe(
      map((feedbacks) => [...feedbacks].sort((first, second) => second.data.localeCompare(first.data)))
    );
  }

  submitFeedback(descricao: string, nota: number): Observable<Feedback> {
    const payload: Feedback = {
      id: Date.now(),
      descricao: descricao.trim(),
      nota,
      data: new Date().toISOString(),
    };

    const apiUrl = this.getApiUrl();

    if (environment.useMockData && !apiUrl) {
      this.addFeedback(payload);
      return of(payload);
    }

    return this.http.post<Feedback>(`${apiUrl}/avaliacao`, payload).pipe(
      tap((response) => this.addFeedback(response ?? payload)),
      catchError(() => {
        this.addFeedback(payload);
        return of(payload);
      })
    );
  }

  private getApiUrl(): string {
    return environment.apiBaseUrl?.replace(/\/$/, '') ?? '';
  }

  private addFeedback(feedback: Feedback): void {
    const current = this.feedbacksSubject.value;
    this.feedbacksSubject.next([feedback, ...current]);
  }
}