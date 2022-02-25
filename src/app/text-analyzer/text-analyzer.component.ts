import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AnalyzedResponse } from '../models';
import { ConfigService } from '../services/config.service';
import { TextAnalyzerService } from '../services/text-analyzer.service';

@Component({
  selector: 'app-text-analyzer',
  templateUrl: './text-analyzer.component.html',
  styleUrls: ['./text-analyzer.component.scss'],
})
export class TextAnalyzerComponent implements OnInit {
  readonly displayedColumns: string[] = [
    'text',
    'type',
    'isOnline',
    'response',
  ];
  private analyzeHistory: {
    text: string;
    type: 'VOWELS' | 'CONSONANTS';
    isOnline: boolean;
    response: AnalyzedResponse;
  }[] = [];

  analyzerForm = new FormGroup({
    text: new FormControl(''),
    type: new FormControl('VOWELS'),
  });

  constructor(
    private textAnalayzerService: TextAnalyzerService,
    private snackBar: MatSnackBar,
    private configService: ConfigService
  ) {}

  ngOnInit(): void {}

  onStartAnalyze(): void {
    if (this.configService.isOnline()) {
      this.analyzeOnline();
    } else {
      this.analyzeOffline();
    }
  }

  public getHistory(): {
    text: string;
    type: 'VOWELS' | 'CONSONANTS';
    isOnline: boolean;
    response: AnalyzedResponse;
  }[] {
    return this.analyzeHistory;
  }

  private analyzeOnline(): void {
    this.textAnalayzerService
      .onlineTextAnalyzer(this.analyzerForm.value)
      .subscribe({
        next: (result: AnalyzedResponse) => {
          this.analyzeHistory = [
            {
              text: this.analyzerForm.get('text')?.value,
              type: this.analyzerForm.get('type')?.value,
              isOnline: true,
              response: result,
            },
            ...this.analyzeHistory,
          ];
        },
        error: (error) => {
          this.snackBar.open(error.message, 'Dismiss');
        },
      });
  }
  private analyzeOffline(): void {
    this.analyzeHistory = [
      {
        text: this.analyzerForm.get('text')?.value,
        type: this.analyzerForm.get('type')?.value,
        isOnline: false,
        response: this.textAnalayzerService.offlineTextAnalyzer(
          this.analyzerForm.value
        ),
      },
      ...this.analyzeHistory,
    ];
  }
}
