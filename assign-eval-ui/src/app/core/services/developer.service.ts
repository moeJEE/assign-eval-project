import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Developer } from '@app/models/project.model';

@Injectable({
  providedIn: 'root',
})
export class DeveloperService {
  private apiUrl = 'http://localhost:8088/api/v1/users'; // Base API URL

  constructor(private http: HttpClient) {}

  /**
   * Fetch all developers (by role 'DEVELOPER').
   */
  getAllDevelopers(): Observable<Developer[]> {
    return this.http.get<Developer[]>(`${this.apiUrl}/developers`);
  }

  /**
   * Fetch a developer by ID.
   * @param id Developer ID
   */
  getDeveloperById(id: number): Observable<Developer> {
    return this.http.get<Developer>(`${this.apiUrl}/${id}`);
  }

  /**
   * Fetch developers by skill IDs.
   * @param skillIds Array of skill IDs
   */
  getDevelopersBySkillIds(skillIds: number[]): Observable<Developer[]> {
    const params = new HttpParams().set('skillIds', skillIds.join(','));
    return this.http.get<Developer[]>(`${this.apiUrl}/searchAll`, { params });
  }

  /**
   * Fetches all users with the 'PROJECT_MANAGER' role.
   */
  getProjectManagers(): Observable<Developer[]> {
    return this.http.get<Developer[]>(`${this.apiUrl}/project-managers`);
  }

  /**
   * Create a new developer.
   * @param developer Developer data
   */
  createDeveloper(developer: Developer): Observable<Developer> {
    return this.http.post<Developer>(`${this.apiUrl}`, developer);
  }

  /**
   * Update an existing developer.
   * @param id Developer ID
   * @param developer Updated developer data
   */
  updateDeveloper(id: number, developer: Developer): Observable<Developer> {
    return this.http.put<Developer>(`${this.apiUrl}/${id}`, developer);
  }

  /**
   * Delete a developer by ID.
   * @param id Developer ID
   */
  deleteDeveloper(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

    // New method to get developers by selected skill IDs
 // Get developers filtered by selected skill IDs
 getDevelopersBySkills(skillIds: number[]): Observable<Developer[]> {
  const params = { skillIds: skillIds.join(',') }; // Convert array to comma-separated string
  return this.http.get<Developer[]>(`${this.apiUrl}/developers-by-skills`, { params });
}
  

  getDeveloperId(): string | null {
    return sessionStorage.getItem('developerId');  // Replace with the actual storage method you're using
  }

  getDevByEmail(): Observable<Developer> {
    const developerId = sessionStorage.getItem('userId'); // Get the developer ID from sessionStorage

    if (!developerId) {
      console.error('Developer ID not found in session');
      return new Observable();  // Return an empty observable if no ID is found
    }

    console.log('Using developer ID:', developerId);

    // Fetch the developer by email using the developer ID
    return this.http.get<Developer>(`${this.apiUrl}/developerByEmail/${developerId}`);
  }


}
