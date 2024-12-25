import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project, Developer, Evaluation, Skill } from '@app/models/project.model';
import { MessageService, MenuItem } from 'primeng/api';
import { ProjectService } from '@app/core/services/project.service';
import { DeveloperService } from '@app/core/services/developer.service';
import { forkJoin } from 'rxjs';
import { SkillService } from '@app/core/services/skill.service';
import { EvaluationService } from '@app/core/services/evaluation.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  providers: [MessageService],
})
export class ProjectDetailsComponent implements OnInit {
  project: Project | undefined;
  events: any[] = [];
  evaluateDialog: boolean = false;
  selectedDeveloper: Developer | null = null;
  rating: number = 0;
  feedback: string = '';
  items: MenuItem[] = [];
  evaluations: Evaluation[] = [];
  numberOfDevelopers: number = 0;
  skills: Skill[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private evaluationService: EvaluationService,
    private route: ActivatedRoute,
    public router: Router,
    private projectService: ProjectService,
    private developerService: DeveloperService,
    private skillService: SkillService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const projectId = Number(this.route.snapshot.paramMap.get('id'));
    if (!projectId || isNaN(projectId)) {
      this.handleError('Invalid or missing project ID');
      return;
    }
  
    this.loadProjectDetails(projectId);
    if (projectId) {
      this.loadEvaluationsForProject(projectId);
    }
  }
  

  loadEvaluationsForProject(projectId: number): void {
    this.evaluationService.getAllEvaluations().subscribe({
      next: (evaluations: Evaluation[]) => {
        this.evaluations = evaluations.filter(evaluation => evaluation.projectId === projectId);
        console.log('Filtered evaluations for project:', this.evaluations);
        this.cdr.detectChanges(); // Ensure UI updates
      },
      error: (err) => {
        console.error('Error fetching evaluations:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load evaluations for the project.',
        });
      },
    });
  }

  loadProjectDetails(projectId: number): void {
    this.projectService.getProjectById(projectId).subscribe({
      next: (project) => {
        this.project = project;
        this.initializeBreadcrumb();
        this.initializeTimeline();
        this.fetchRelatedData();
        console.log('Fetched project:', project);
      },
      error: () => {
        this.handleError('Failed to fetch project details');
      },
    });
  }

  initializeBreadcrumb(): void {
    this.items = [
      { label: 'Projects', url: '/project-manager/pages/projects' },
      { label: this.project?.title || 'Project Details' },
    ];
  }

  initializeTimeline(): void {
    if (!this.project?.startDate || !this.project?.endDate) {
      console.warn('Project start date or end date is missing.');
      return;
    }
  
    const startDate = new Date(this.project.startDate);
    const endDate = new Date(this.project.endDate);
  
    this.events = [
      { status: 'Project Started', date: startDate },
      { status: 'Project Finished', date: endDate },
    ];
  }
  

  fetchRelatedData(): void {
    if (!this.project) {
      console.warn('No project found to fetch related data.');
      return;
    }

    const developerIds = this.project.developerIds || [];
    const skillIds = this.project.skillIds || [];

    forkJoin({
      developers: this.developerService.getAllDevelopers(),
      skills: this.skillService.getAllSkills(),
    }).subscribe({
      next: ({ developers, skills }) => {
        this.project!.developers = developerIds
          .map(id => developers.find(developer => developer.id === id))
          .filter((dev): dev is Developer => dev !== undefined);
        this.numberOfDevelopers = this.project!.developers.length;
        this.skills = skills.filter(skill => skillIds.includes(skill.id));
        console.log('Mapped developers:', this.project!.developers);
        console.log('Mapped skills:', this.skills);
      },
      error: (err) => {
        console.error('Error fetching related data:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load related data (developers or skills).',
        });
      },
    });
  }

  developerEvaluationExists(developer: Developer): boolean {
    return this.evaluations.some(evaluation => evaluation.developerId === developer.id);
  }

  openEvaluateDialog(developer: Developer): void {
    if (!developer) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Developer information is missing.',
      });
      return;
    }
    this.selectedDeveloper = developer;
    this.rating = 0;
    this.feedback = '';
    this.evaluateDialog = true;
  }

  submitEvaluation(): void {
    if (this.selectedDeveloper && this.project?.id !== undefined) {
      const evaluation: Partial<Evaluation> = {
        projectId: this.project.id, // Safe because of the guard
        developerId: this.selectedDeveloper.id,
        rating: this.rating,
        feedback: this.feedback,
      };
  
      this.evaluationService.createEvaluation(evaluation).subscribe({
        next: () => {
          this.loadEvaluationsForProject(this.project!.id!); // Using non-null assertion
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Evaluation saved successfully!',
          });
          this.evaluateDialog = false;
        },
        error: (err) => {
          console.error('Error saving evaluation:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to save evaluation.',
          });
        },
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Project or developer information is missing.',
      });
    }
  }
  
  

  viewEvaluation(developer: Developer): void {
    const evaluation = this.evaluations.find(e => e.developerId === developer.id);
    if (evaluation) {
      this.selectedDeveloper = developer;
      this.rating = evaluation.rating;
      this.feedback = evaluation.feedback;
      this.evaluateDialog = true; // Open the dialog with evaluation details
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Evaluation',
        detail: 'This developer does not have an evaluation yet.',
        life: 3000,
      });
    }
  }
  
  cancelEvaluation(): void {
    this.evaluateDialog = false;
  }

  private handleError(detail: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail,
    });
    this.router.navigate(['/project-manager/pages/projects']);
  }

  openEvaluationDialog(developer: Developer): void {
    const evaluation = this.evaluations.find(e => e.developerId === developer.id);
  
    this.selectedDeveloper = developer;
    this.evaluateDialog = true;
  
    if (evaluation) {
      // Populate dialog with existing evaluation for editing
      this.rating = evaluation.rating;
      this.feedback = evaluation.feedback;
    } else {
      // Initialize new evaluation
      this.rating = 0;
      this.feedback = '';
    }
  }

  
  getEvaluationButtonLabel(developer: Developer): string {
    return this.developerEvaluationExists(developer) ? 'See Evaluation' : 'Evaluate';
  }
  
  getEvaluationButtonIcon(developer: Developer): string {
    return this.developerEvaluationExists(developer) ? 'pi pi-eye' : 'pi pi-star';
  }
  
  handleEvaluationClick(developer: Developer): void {
    if (this.developerEvaluationExists(developer)) {
      this.viewEvaluation(developer);
    } else {
      this.openEvaluateDialog(developer);
    }
  }

  deleteEvaluation(evaluationId: number): void {
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this evaluation?')) {
      return;
    }
  
    // Call the evaluation service to delete the evaluation
    this.evaluationService.deleteEvaluation(evaluationId).subscribe({
      next: () => {
        // Remove the deleted evaluation from the local list
        this.evaluations = this.evaluations.filter(evaluation => evaluation.evaluationId !== evaluationId);
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Evaluation deleted successfully!',
        });
      },
      error: (err) => {
        console.error('Error deleting evaluation:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete evaluation.',
        });
      },
    });
  }


  
  
}
