// src/app/project-manager/pages/projects/projects.component.ts

import { Component, OnInit } from '@angular/core';
import { ProjectService } from '@app/core/services/project.service';
import { SkillService } from '@app/core/services/skill.service';
import { DeveloperService } from '@app/core/services/developer.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { forkJoin, Observable } from 'rxjs';
import {
  Project,
  ProjectRequest,
  ProjectResponse,
  Skill,
  Developer,
  User,
} from '@app/models/project.model';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  providers: [MessageService],
})
export class ProjectsComponent implements OnInit {
  projectDialog: boolean = false;
  deleteProjectDialog: boolean = false;
  deleteProjectsDialog: boolean = false;

  currentProject: ProjectResponse | null = null;

  projects: ProjectResponse[] = [];
  selectedProjects: ProjectResponse[] = [];

  projectFormData: ProjectRequest = this.initializeProjectRequest();
  isEditMode: boolean = false;
  submitted: boolean = false;

  skillsOptions: Skill[] = [];
  developersOptions: Developer[] = [];
  projectManagers: Developer[] = [];

  selectedSkills: number[] = [];
  selectedDevelopers: number[] = [];
  selectedProjectManagerId: number | null = null;

  cols: any[] = [];

  statusOptions = [
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Review', value: 'REVIEW' },
  ];

  constructor(
    private projectService: ProjectService,
    private skillService: SkillService,
    private developerService: DeveloperService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'code', header: 'Code' },
      { field: 'title', header: 'Title' },
      { field: 'status', header: 'Status' },
      { field: 'projectManager', header: 'Project Manager' },
      { field: 'developers', header: 'Developers' },
      { field: 'startDate', header: 'Start Date' },
      { field: 'endDate', header: 'End Date' },
      { field: 'actions', header: 'Actions' },
    ];
    this.loadProjects();
    this.loadSkills();
    this.loadDevelopers();
    this.loadProjectManagers();
  }

  initializeProjectRequest(): ProjectRequest {
    return {
      code: '',
      title: '',
      description: '',
      status: 'IN_PROGRESS',
      startDate: '',
      endDate: '',
      skillIds: [],
      developerIds: [],
      projectManagerId: 0,
    };
  }

  loadProjects() {
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
  
        // Fetch project managers and developers
        forkJoin({
          projectManagers: this.developerService.getProjectManagers(),
          developers: this.developerService.getAllDevelopers(),
        }).subscribe({
          next: ({ projectManagers, developers }) => {
            // Map project managers and developers to projects
            this.projects.forEach((project) => {
              project.projectManager = projectManagers.find(
                (pm) => pm.id === project.projectManagerId
              );
              project.developers = project.developerIds
                .map((devId) => developers.find((dev) => dev.id === devId))
                .filter((dev): dev is Developer => dev !== undefined); // Filter out undefined
            });
          },
          error: (err) => console.error('Error loading related data:', err),
        });
      },
      error: (err) => {
        console.error('Error loading projects:', err);
      },
    });
  }
  

  loadSkills() {
    this.skillService.getAllSkills().subscribe({
      next: (skills) => {
        this.skillsOptions = skills;
      },
      error: (error) => {
        console.error('Error loading skills:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load skills',
        });
      },
    });
  }

  loadDevelopers() {
    this.developerService.getAllDevelopers().subscribe({
        next: (developers) => {
            this.developersOptions = developers.map((dev) => ({
                ...dev,
                fullName: `${dev.firstname} ${dev.lastname}`,
            }));
        },
        error: (error) => {
            console.error('Error loading developers:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.error.message || 'Failed to load developers',
            });
        },
    });
}


loadProjectManagers() {
  this.developerService.getProjectManagers().subscribe({
      next: (managers) => {
          this.projectManagers = managers.map((manager) => ({
              ...manager,
              fullName: `${manager.firstname} ${manager.lastname}`,
          }));
      },
      error: (error) => {
          console.error('Error loading project managers:', error);
          this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error.message || 'Failed to load project managers',
          });
      },
  });
}


  openNew() {
    this.projectFormData = this.initializeProjectRequest();
    this.selectedSkills = [];
    this.selectedDevelopers = [];
    this.selectedProjectManagerId = null;
    this.isEditMode = false;
    this.projectDialog = true;
    this.submitted = false;
  }

  editProject(project: ProjectResponse) {
    this.projectFormData = {
      code: project.code,
      title: project.title,
      description: project.description,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate,
      skillIds: [...project.skillIds],
      developerIds: [...project.developerIds],
      projectManagerId: project.projectManagerId,
    };
    this.selectedSkills = [...project.skillIds];
    this.selectedDevelopers = [...project.developerIds];
    this.selectedProjectManagerId = project.projectManagerId;
    this.isEditMode = true;
    this.projectDialog = true;
    this.submitted = false;
  }

  saveProject() {
    this.submitted = true;
  
    console.log('Project Form Data:', this.projectFormData);
    console.log('Selected Project Manager ID:', this.selectedProjectManagerId);
    console.log('Selected Skills:', this.selectedSkills);
    console.log('Selected Developers:', this.selectedDevelopers);
  
    // Validate required fields
    if (
      !this.projectFormData.code?.trim() ||
      !this.projectFormData.title?.trim() ||
      !this.projectFormData.status ||
      !this.projectFormData.startDate ||
      !this.projectFormData.endDate ||
      !this.selectedProjectManagerId ||
      this.selectedSkills.length === 0 ||
      this.selectedDevelopers.length === 0
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Please fill all required fields.',
      });
      return;
    }
  
    // Update projectFormData with selected values
    this.projectFormData.projectManagerId = this.selectedProjectManagerId!;
    this.projectFormData.skillIds = [...this.selectedSkills];
    this.projectFormData.developerIds = [...this.selectedDevelopers];
  
    // Validate date logic
    const startDate = new Date(this.projectFormData.startDate);
    const endDate = new Date(this.projectFormData.endDate);
    if (endDate < startDate) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'End Date cannot be earlier than Start Date.',
      });
      return;
    }
  
    console.log('Updated Project Form Data:', this.projectFormData);
  
    // Proceed with save or update logic
    if (this.isEditMode && this.projectFormData.id) {
      this.projectService.updateProject(this.projectFormData.id, this.projectFormData).subscribe({
        next: (updatedProject) => {
          console.log('Project Updated:', updatedProject);
          this.loadProjects();
          this.projectDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Project updated successfully.',
          });
        },
        error: (err) => {
          console.error('Error updating project:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update project.',
          });
        },
      });
    }
     else {
      // Create new project logic
      this.projectService.createProject(this.projectFormData).subscribe({
        next: (newProject) => {
          console.log('Project Created:', newProject);
          this.loadProjects(); // Reload projects
          this.projectDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Project created successfully.',
          });
        },
        error: (err) => {
          console.error('Error creating project:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create project.',
          });
        },
      });
    }
  }

  formatDate(date: string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (`0${d.getMonth() + 1}`).slice(-2);
    const day = (`0${d.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  }

  onSkillChange() {
    this.selectedDevelopers = [];
    this.projectFormData.developerIds = [];
    if (this.selectedSkills.length > 0) {
      this.developerService.getDevelopersBySkillIds(this.selectedSkills).subscribe({
        next: (developers) => {
          this.developersOptions = developers.map((dev) => ({
            ...dev,
            fullName: `${dev.firstname} ${dev.lastname}`,
          }));
        },
        error: (error) => {
          console.error('Error loading developers based on selected skills:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load developers based on selected skills',
          });
        },
      });
    } else {
      this.developersOptions = [];
    }
  }

  deleteProject(project: ProjectResponse) {
    this.currentProject = project;
    this.deleteProjectDialog = true;
  }

  confirmDelete() {
    if (this.currentProject && this.currentProject.id) {
      this.projectService.deleteProject(this.currentProject.id).subscribe({
        next: () => {
          this.projects = this.projects.filter((p) => p.id !== this.currentProject!.id);
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Project Deleted',
          });
        },
        error: (error) => {
          console.error('Error deleting project:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete project',
          });
        },
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Project not found for deletion.',
      });
    }
    this.deleteProjectDialog = false;
    this.currentProject = null;
  }

  deleteSelectedProjects() {
    this.deleteProjectsDialog = true;
  }

  confirmDeleteSelected() {
    const deleteObservables: Observable<void>[] = this.selectedProjects.map((project) => {
      if (project.id) {
        return this.projectService.deleteProject(project.id);
      }
      return new Observable<void>();
    });

    forkJoin(deleteObservables).subscribe({
      next: () => {
        this.projects = this.projects.filter(
          (p) => !this.selectedProjects.some((sp) => sp.id === p.id)
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Selected Projects Deleted',
        });
        this.selectedProjects = [];
      },
      error: (error) => {
        console.error('Error deleting selected projects:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete selected projects',
        });
      },
    });

    this.deleteProjectsDialog = false;
  }

  getProjectIdByCode(code: string): number | undefined {
    const project = this.projects.find((p) => p.code === code);
    return project ? project.id : undefined;
  }

  onGlobalFilter(event: Event, table: Table) {
    const input = event.target as HTMLInputElement;
    table.filterGlobal(input.value, 'contains');
  }

  filterProjects() {
    if (this.selectedSkills.length === 0) {
      this.loadProjects();
    } else {
      this.projectService.getProjectsBySkills(this.selectedSkills).subscribe({
        next: (projects) => {
          this.projects = projects;
        },
        error: (error) => {
          console.error('Error filtering projects by skills:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to filter projects by skills',
          });
        },
      });
    }
  }
}
