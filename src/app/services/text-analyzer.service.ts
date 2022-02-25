import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AnalyzedResponse } from '../models';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class TextAnalyzerService {
  private static readonly VOWELS_UPPERCASE = new Set<string>([
    'A',
    'E',
    'I',
    'O',
    'U',
  ]);

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {}

  public onlineTextAnalyzer(params: {
    text: string;
    type: 'VOWELS' | 'CONSONANTS';
  }): Observable<AnalyzedResponse> {
    return this.httpClient.get<AnalyzedResponse>(
      `${this.configService.getRestServiceUrl()}/analyze/text`,
      {
        params: new HttpParams()
          .append('input', params.text)
          .append('type', params.type),
      }
    );
  }

  public offlineTextAnalyzer(params: {
    text: string;
    type: 'VOWELS' | 'CONSONANTS';
  }): AnalyzedResponse {
    let vowelMap: AnalyzedResponse = {};
    let consonantsMap: AnalyzedResponse = {};
    TextAnalyzerService.VOWELS_UPPERCASE.forEach(function (value) {
      vowelMap[value] = 0;
    });
    for (let i = 0; i < params.text.length; i++) {
      const searchChar: string = params.text.toUpperCase().charAt(i);
      if (TextAnalyzerService.VOWELS_UPPERCASE.has(searchChar)) {
        vowelMap[searchChar] = vowelMap[searchChar] + 1;
      } else {
        consonantsMap[searchChar] = consonantsMap[searchChar]
          ? consonantsMap[searchChar] + 1
          : 1;
      }
    }
    switch (params.type) {
      case 'VOWELS':
        return vowelMap;
      case 'CONSONANTS':
        return consonantsMap;
      default:
        return {};
    }
  }
}
