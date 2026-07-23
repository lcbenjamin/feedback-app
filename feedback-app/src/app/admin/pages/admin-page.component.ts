import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartData, registerables } from 'chart.js';
import { map, shareReplay, Subscription } from 'rxjs';

import { Feedback } from '../../models/feedback.model';
import { FeedbackService } from '../../services/feedback.service';

Chart.register(...registerables);

interface AdminStats {
  total: number;
  average: number;
  byDay: Array<{ day: string; count: number }>;
  noteDistribution: Array<{ label: string; count: number }>;
}

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('distributionChart') chartCanvas?: ElementRef<HTMLCanvasElement>;

  readonly feedbacks$ = this.feedbackService.getFeedbacks().pipe(shareReplay(1));
  readonly stats$ = this.feedbacks$.pipe(map((feedbacks) => this.buildStats(feedbacks)));
  readonly displayedColumns = ['descricao', 'nota', 'data'];

  private chart?: Chart<'bar'>;
  private feedbacksSubscription?: Subscription;

  constructor(
    private readonly feedbackService: FeedbackService
  ) {}

  ngAfterViewInit(): void {
    this.feedbacksSubscription = this.feedbacks$.subscribe((feedbacks: Feedback[]) => this.renderChart(feedbacks));
  }

  ngOnDestroy(): void {
    this.feedbacksSubscription?.unsubscribe();
    this.chart?.destroy();
  }

  trackById(_: number, feedback: Feedback): number {
    return feedback.id;
  }

  private buildStats(feedbacks: Feedback[]): AdminStats {
    const byDayMap = new Map<string, number>();
    const noteDistribution = Array.from({ length: 11 }, (_, index) => ({ label: `${index}`, count: 0 }));

    let sum = 0;

    for (const feedback of feedbacks) {
      sum += feedback.nota;

      const day = new Date(feedback.data).toLocaleDateString('pt-BR');
      byDayMap.set(day, (byDayMap.get(day) ?? 0) + 1);

      const bucket = noteDistribution[feedback.nota];
      if (bucket) {
        bucket.count += 1;
      }
    }

    return {
      total: feedbacks.length,
      average: feedbacks.length ? Number((sum / feedbacks.length).toFixed(2)) : 0,
      byDay: Array.from(byDayMap.entries()).map(([day, count]) => ({ day, count })),
      noteDistribution,
    };
  }

  private renderChart(feedbacks: Feedback[]): void {
    if (!this.chartCanvas) {
      return;
    }

    const buckets = Array.from({ length: 11 }, (_, index) =>
      feedbacks.filter((feedback) => feedback.nota === index).length
    );

    const data: ChartData<'bar'> = {
      labels: Array.from({ length: 11 }, (_, index) => `${index}`),
      datasets: [
        {
          label: 'Quantidade de feedbacks',
          data: buckets,
          backgroundColor: '#007c91',
          borderRadius: 10,
        },
      ],
    };

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
          },
        },
      },
    };

    this.chart?.destroy();
    this.chart = new Chart(this.chartCanvas.nativeElement, config);
  }
}