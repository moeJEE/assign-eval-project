// src/app/core/services/project.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';  // Import the `tap` operator
import { Project, ProjectRequest, ProjectResponse } from '@app/models/project.model';
import { AuthService } from '@app/core/services/auth.service'; // Import AuthService

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:8088/api/v1/projects'; // Ensure this is correct

  constructor(private http: HttpClient, private authService: AuthService) { }

  /**
   * Fetches all projects.
   */
  getProjects(): Observable<ProjectResponse[]> {
    return this.http.get<ProjectResponse[]>(this.apiUrl);
  }

  /**
   * Fetches a project by its ID.
   * @param id - Project ID
   */
  getProjectById(id: number): Observable<ProjectResponse> {
    return this.http.get<ProjectResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Creates a new project.
   * @param project - Project data
   */
  createProject(project: ProjectRequest): Observable<ProjectResponse> {
    return this.http.post<ProjectResponse>(this.apiUrl, project);
  }

  /**
   * Updates an existing project.
   * @param id - Project ID
   * @param project - Updated project data
   */
  updateProject(id: number, project: ProjectRequest): Observable<ProjectResponse> {
    return this.http.put<ProjectResponse>(`${this.apiUrl}/${id}`, project);
  }

  /**
   * Deletes a project by its ID.
   * @param id - Project ID
   */
  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Fetches projects filtered by skill IDs.
   * @param skillIds - Array of skill IDs
   */
  getProjectsBySkills(skillIds: number[]): Observable<ProjectResponse[]> {
    let params = new HttpParams();
    skillIds.forEach(id => {
      params = params.append('skillIds', id.toString());
    });
    return this.http.get<ProjectResponse[]>(`${this.apiUrl}/filter`, { params });
  }

  /**
   * Fetches projects assigned to the current developer.
   */
  getProjectsForDeveloper(): Observable<ProjectResponse[]> {
    const developerId = this.authService.getUserId();  // Get the developer ID (not email)
    
    if (!developerId) {
      console.error('Developer ID not found in session');
      return of([]);  // Return empty array if no developer ID is found
    }
  
    console.log('Using developer ID:', developerId);
  
    return this.http.get<ProjectResponse[]>(`${this.apiUrl}/assignedTo/${developerId}`).pipe(
      tap((projects: ProjectResponse[]) => {
        console.log('Retrieved projects:', projects);
      })
    );
  }
  
}
