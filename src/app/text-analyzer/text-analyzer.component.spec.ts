import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { HarnessLoader, parallel } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatTableHarness } from '@angular/material/table/testing';
import { of, throwError } from 'rxjs';
import { AnalyzedResponse } from '../models';
import { ConfigService } from '../services/config.service';
import { TextAnalyzerService } from '../services/text-analyzer.service';

import { TextAnalyzerComponent } from './text-analyzer.component';

describe('TextAnalyzerComponent', () => {
  let component: TextAnalyzerComponent;
  let fixture: ComponentFixture<TextAnalyzerComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TextAnalyzerComponent],
      imports: [HttpClientTestingModule, MatSnackBarModule, MatTableModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextAnalyzerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should execute online analyze procedure on submit', () => {
    const expected: AnalyzedResponse = { A: 1, E: 2, I: 0, O: 3, U: 0 };
    const analyzerServiceSpy = spyOn(
      TestBed.inject(TextAnalyzerService),
      'onlineTextAnalyzer'
    ).and.returnValue(of(expected));
    const configServiceSpy = spyOn(
      TestBed.inject(ConfigService),
      'isOnline'
    ).and.returnValue(true);

    component.onStartAnalyze();

    expect(analyzerServiceSpy).toHaveBeenCalled();
    expect(component.getHistory()).toEqual([
      { text: '', type: 'VOWELS', isOnline: true, response: expected },
    ]);
  });

  it('should show snackbar on online analyze error', () => {
    const errorMessage: string = 'Some custom test error';
    const analyzerServiceSpy = spyOn(
      TestBed.inject(TextAnalyzerService),
      'onlineTextAnalyzer'
    ).and.returnValue(throwError(() => new Error(errorMessage)));
    const configServiceSpy = spyOn(
      TestBed.inject(ConfigService),
      'isOnline'
    ).and.returnValue(true);
    const snackBarSpy = spyOn(TestBed.inject(MatSnackBar), 'open');

    component.onStartAnalyze();

    expect(snackBarSpy).toHaveBeenCalledOnceWith(errorMessage, 'Dismiss');
    expect(analyzerServiceSpy).toHaveBeenCalled();
    expect(component.getHistory().length).toEqual(0);
  });

  it('should execute offline analyze procedure on submit', () => {
    const expected: AnalyzedResponse = { A: 1, E: 2, I: 0, O: 3, U: 0 };
    const analyzerServiceSpy = spyOn(
      TestBed.inject(TextAnalyzerService),
      'offlineTextAnalyzer'
    ).and.returnValue(expected);
    const configServiceSpy = spyOn(
      TestBed.inject(ConfigService),
      'isOnline'
    ).and.returnValue(false);

    component.onStartAnalyze();

    expect(analyzerServiceSpy).toHaveBeenCalled();
    expect(component.getHistory()).toEqual([
      { text: '', type: 'VOWELS', isOnline: false, response: expected },
    ]);
  });

  it('previous outputs should be visible at the UI on execute', async () => {
    const expected: AnalyzedResponse = { A: 1, E: 2, I: 0, O: 3, U: 0 };
    const analyzerServiceSpy = spyOn(
      TestBed.inject(TextAnalyzerService),
      'onlineTextAnalyzer'
    ).and.returnValue(of(expected));
    const configServiceSpy = spyOn(
      TestBed.inject(ConfigService),
      'isOnline'
    ).and.returnValue(true);

    component.onStartAnalyze();

    let table = await loader.getHarness(MatTableHarness);
    let headerRows = await table.getHeaderRows();
    let rows = await table.getRows();
    expect(headerRows.length).toBe(1);
    expect(rows.length).toBe(1);

    component.onStartAnalyze();

    table = await loader.getHarness(MatTableHarness);
    rows = await table.getRows();
    expect(rows.length).toBe(2);

    expect(analyzerServiceSpy).toHaveBeenCalledTimes(2);
  });
});
