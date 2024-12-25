import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Developer, Evaluation, Project } from '@app/models/project.model';
import { DeveloperService } from '@app/core/services/developer.service';
import { ProjectService } from '@app/core/services/project.service';
import { MessageService } from 'primeng/api';
import { SkillService } from '@app/core/services/skill.service';

interface Skill {
  skillId: number;
  skillName: string;
}

@Component({
  selector: 'app-developer-details',
  templateUrl: './developer-details.component.html',
  styleUrls: ['./developer-details.component.css'],
  providers: [MessageService],
})
export class DeveloperDetailsComponent implements OnInit {
  developer: Developer | undefined;
  developerSkills: Skill[] = [];
  evaluations: Evaluation[] = [];
  evaluateDialog: boolean = false;
  ranking: number = 0;
  feedback: string = '';
  items: any[] = [];
  associatedProjects: Project[] = [];
  events: any[] = [];
  skillsOptions: { id: number; name: string; description?: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private developerService: DeveloperService,
    private projectService: ProjectService,
    private messageService: MessageService,
    private skillService: SkillService
  ) {}

  ngOnInit(): void {
    this.items = [
      { label: 'Developers', routerLink: '/developers' },
      { label: 'Developer Details' },
    ];

    const id: string | null = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSkills();
      this.loadDeveloperDetails(id);
      this.loadEvaluations(id);
      this.loadAssociatedProjects(id);
      this.loadTimelineEvents(id);
    }
  }

  loadSkills(): void {
    this.skillService.getAllSkills().subscribe({
      next: (skills) => {
        this.skillsOptions = skills;

        if (this.developer) {
          this.updateDeveloperSkills();
        }
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

  private updateDeveloperSkills(): void {
    if (this.developer && Array.isArray(this.developer.skills)) {
      this.developerSkills = this.developer.skills.map((skill: any) => {
        const skillId = typeof skill === 'number' ? skill : skill.skillId;
        const foundSkill = this.skillsOptions.find((option) => option.id === skillId);

        return {
          skillId: skillId,
          skillName: foundSkill ? foundSkill.name : 'Unknown'
        };
      });
    }
  }

  loadDeveloperDetails(id: string): void {
    this.developerService.getDeveloperById(Number(id)).subscribe({
      next: (developer: Developer) => {
        this.developer = developer;
        if (this.skillsOptions.length > 0) {
          this.updateDeveloperSkills();
        }
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load developer details',
        }),
    });
  }

  loadEvaluations(developerId: string): void {
    this.evaluations = [
    ];
  }

  loadAssociatedProjects(developerId: string): void {
    this.projectService.getProjects().subscribe({
      next: (projects: Project[]) => {
        this.associatedProjects = projects.filter((project) =>
          project.developerIds?.includes(Number(developerId))
        );
        console.log('Associated projects:', this.associatedProjects);
      },
      error: (error) => {
        console.error('Error loading associated projects:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load associated projects',
        });
      },
    });
  }

  loadTimelineEvents(developerId: string): void {
    this.events = [
      { date: '2023-01-01', status: 'Joined the team' },
      { date: '2023-03-15', status: 'Completed Project Alpha' },
    ];
  }

  openEvaluateDialog(): void {
    this.evaluateDialog = true;
    this.ranking = 0;
    this.feedback = '';
  }

  submitEvaluation(): void {
    if (this.developer && this.developer.id !== undefined) {
      const evaluation: Evaluation = {
        evaluationId: this.evaluations.length + 1,
        projectId: 0,
        projectManagerId: 0,
        developerId: this.developer.id,
        developerName: `${this.developer.firstname} ${this.developer.lastname}`,
        rating: this.ranking,
        feedback: this.feedback,
        createdAt: new Date().toISOString(),
      };

      this.evaluations.push(evaluation);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Evaluation submitted for ${this.developer.firstname} ${this.developer.lastname}`,
      });

      this.evaluateDialog = false;
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Developer not found.',
      });
    }
  }

  cancelEvaluation(): void {
    this.evaluateDialog = false;
  }

  getSkillNameById(skillId: number): string {
    const skill = this.developerSkills.find(s => s.skillId === skillId);
    return skill ? skill.skillName : 'Unknown';
  }
}
