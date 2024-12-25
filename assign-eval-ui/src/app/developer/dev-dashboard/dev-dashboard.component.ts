import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LayoutService } from '@app/layout/service/app.layout.service';
import { ProjectService } from '@app/core/services/project.service';
import { DeveloperService } from '@app/core/services/developer.service';
import { SkillService } from '@app/core/services/skill.service';
import { EvaluationService } from '@app/core/services/evaluation.service';
import { ProjectResponse, Developer, Skill, Evaluation } from '@app/models/project.model';

interface NormalizedDeveloper extends Omit<Developer, 'skills'> {
    skills: number[];
}

@Component({
  templateUrl: './dev-dashboard.component.html',
})
export class DevDashboardComponent implements OnInit, OnDestroy {
  projects!: ProjectResponse[];
  skills!: Skill[];
  evaluations!: Evaluation[];

  newProjectsCount: number = 0;
  newSkillsCount: number = 0;
  newEvaluationsCount: number = 0;
  performanceRating: string = 'N/A';  // Placeholder for performance rating
  performanceImprovement: string = 'N/A';  // Placeholder for improvement
  
  chartData: any;
  chartOptions: any;

  subscription!: Subscription;

  constructor(
    private projectService: ProjectService,
    private developerService: DeveloperService,
    private skillService: SkillService,
    private evaluationService: EvaluationService,
    public layoutService: LayoutService
  ) {
    this.subscription = this.layoutService.configUpdate$.subscribe(() => {
      this.initChart();
    });
  }

  ngOnInit() {
    this.initChart();
    this.loadProjects();
    this.loadSkills();
    this.loadEvaluations();
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.chartData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Projects Completed',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
          borderColor: documentStyle.getPropertyValue('--bluegray-700'),
          tension: 0.4,
        },
        {
          label: 'Skills Acquired',
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          backgroundColor: documentStyle.getPropertyValue('--green-600'),
          borderColor: documentStyle.getPropertyValue('--green-600'),
          tension: 0.4,
        },
      ],
    };

    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }

  loadProjects() {
    this.projectService.getProjects().subscribe({
      next: (data) => {
        // Filter projects assigned to this developer (assuming you can filter by developer)
        this.projects = data.filter(project => 
          project.developers.some(developer => developer.id === this.getCurrentDeveloperId())
        );
                this.newProjectsCount = this.projects.filter((project) => this.isNew(project.createdAt)).length;
      },
      error: (err) => console.error('Failed to load projects', err),
    });
  }

  loadSkills() {
    this.skillService.getAllSkills().subscribe({
      next: (data: Skill[]) => {
        this.skills = data;
        this.newSkillsCount = data.filter((skill) => this.isNew(skill.createdAt)).length;
      },
      error: (err) => console.error('Failed to load skills', err),
    });
  }

  loadEvaluations() {
    this.evaluationService.getAllEvaluations().subscribe({
      next: (data) => {
        this.evaluations = data;
        this.newEvaluationsCount = data.filter((evaluation) => this.isNew(evaluation.createdAt)).length;
      },
      error: (err) => console.error('Failed to load evaluations', err),
    });
  }

  isNew(date: string | undefined): boolean {
    if (!date) return false;
    const today = new Date();
    const itemDate = new Date(date);
    const diffInDays = (today.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24);
    return diffInDays <= 7;
  }

  getDeveloperFullName(developer: NormalizedDeveloper): string {
    return `${developer.firstname || 'Unknown'} ${developer.lastname || ''}`.trim();
  }

  getDeveloperSkills(developer: NormalizedDeveloper): string {
    const skillNames = developer.skills.map((skillId) => {
      const skill = this.skills.find((s) => s.id === skillId);
      return skill ? skill.name : 'Unknown skill';
    });

    return skillNames.join(', ');
  }

  getCurrentDeveloperId(): number {
    // This is a placeholder function, assuming you have a way to get the logged-in developer's ID
    return 1; // Example: replace with actual logic
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
