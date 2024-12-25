import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evaluation } from '@app/models/project.model';

@Injectable({
  providedIn: 'root',
})
export class EvaluationService {
  private apiUrl = 'http://localhost:8088/api/v1/evaluations';

  constructor(private http: HttpClient) {}

  // Fetch all evaluations
  getAllEvaluations(): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(this.apiUrl);
  }

  // Fetch a single evaluation by ID
  getEvaluationById(id: number): Observable<Evaluation> {
    return this.http.get<Evaluation>(`${this.apiUrl}/${id}`);
  }

  // Create a new evaluation
  createEvaluation(evaluation: Partial<Evaluation>): Observable<Evaluation> {
    return this.http.post<Evaluation>(this.apiUrl, evaluation);
  }

  // Update an existing evaluation
  updateEvaluation(id: number, evaluation: Partial<Evaluation>): Observable<Evaluation> {
    return this.http.put<Evaluation>(`${this.apiUrl}/${id}`, evaluation);
  }

  // Delete an evaluation by ID
  deleteEvaluation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
}
