// src/app/core/services/skill.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Skill } from '@app/models/project.model';

@Injectable({
  providedIn: 'root',
})
export class SkillService {
  private apiUrl = 'http://localhost:8088/api/v1/skills'; // Ensure this is correct

  constructor(private http: HttpClient) {}

  /**
   * Fetch all skills.
   */
  getAllSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>(this.apiUrl);
  }

}
