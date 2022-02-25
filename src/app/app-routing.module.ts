import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TextAnalyzerComponent } from './text-analyzer/text-analyzer.component';

const routes: Routes = [
  { path: '', component: TextAnalyzerComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
