import { inject, TestBed, waitForAsync } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { TextAnalyzerService } from './text-analyzer.service';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { ConfigService } from './config.service';

describe('TextAnalyzerService', () => {
  let service: TextAnalyzerService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(TextAnalyzerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should offline analyze text for vowels successfully', () => {
    expect(
      service.offlineTextAnalyzer({ text: 'aeiou', type: 'VOWELS' })
    ).toEqual({ A: 1, E: 1, I: 1, O: 1, U: 1 });
  });

  it('should offline show count zero for vowels and empty test', () => {
    expect(service.offlineTextAnalyzer({ text: '', type: 'VOWELS' })).toEqual({
      A: 0,
      E: 0,
      I: 0,
      O: 0,
      U: 0,
    });
  });

  it('should offline analyze test for consonants successfully', () => {
    expect(
      service.offlineTextAnalyzer({ text: 'asdfD', type: 'CONSONANTS' })
    ).toEqual({ S: 1, D: 2, F: 1 });
  });

  it(
    'should expect a GET for analyze/text',
    waitForAsync(() => {
      let backend = TestBed.inject(HttpTestingController);
      let configService = TestBed.inject(ConfigService);

      service.onlineTextAnalyzer({ text: 'abc', type: 'VOWELS' }).subscribe();
      service
        .onlineTextAnalyzer({ text: 'abcd', type: 'CONSONANTS' })
        .subscribe();

      backend.expectOne({
        url: `${configService.getRestServiceUrl()}/analyze/text?input=abc&type=VOWELS`,
        method: 'GET',
      });
      backend.expectOne({
        url: `${configService.getRestServiceUrl()}/analyze/text?input=abcd&type=CONSONANTS`,
        method: 'GET',
      });
    })
  );
});
