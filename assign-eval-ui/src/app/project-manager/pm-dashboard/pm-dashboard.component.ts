import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
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
    templateUrl: './pm-dashboard.component.html',
})
export class PmDashboardComponent implements OnInit, OnDestroy {
    items!: MenuItem[];
    skillsOptions: { id: number; name: string }[] = [];

    projects!: ProjectResponse[];
    developers: NormalizedDeveloper[] = [];
    skills!: Skill[];
    evaluations: Evaluation[] = [];

    newProjectsCount: number = 0;
    newDevelopersCount: number = 0;
    newSkillsCount: number = 0;
    newEvaluationsCount: number = 0;

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
        this.loadDevelopers();
        this.loadSkills();
        this.loadEvaluations();

        this.items = [
            { label: 'Add New Project', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove Project', icon: 'pi pi-fw pi-minus' },
        ];
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
                    label: 'Developers Joined',
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
                this.projects = data;
                this.newProjectsCount = data.filter((project) => this.isNew(project.createdAt)).length;
            },
            error: (err) => console.error('Failed to load projects', err),
        });
    }

    loadDevelopers() {
        this.developerService.getAllDevelopers().subscribe({
            next: (data: Developer[]) => {
                this.developers = data.map((developer) => {
                    const normalizedSkills = developer.skills
                        .map((skill: any) => {
                            if (typeof skill === 'number') return skill;
                            if (typeof skill === 'object') {
                                if ('id' in skill) return skill.id;
                                if ('skillId' in skill) return skill.skillId;
                            }
                            return null;
                        })
                        .filter((skillId): skillId is number => skillId !== null);

                    return {
                        ...developer,
                        skills: normalizedSkills,
                    };
                });
                this.newDevelopersCount = this.developers.filter((dev) => this.isNew(dev.createdAt)).length;
            },
            error: (err) => console.error('Failed to load developers', err),
        });
    }

    loadSkills() {
        this.skillService.getAllSkills().subscribe({
            next: (data: Skill[]) => {
                this.skills = data;
                this.newSkillsCount = data.filter((skill) => this.isNew(skill.createdAt)).length;

                // Populate skillsOptions
                this.skillsOptions = data.map((skill) => ({
                    id: skill.id,
                    name: skill.name,
                }));
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
        if (!developer.skills || developer.skills.length === 0) {
            return 'No skills listed';
        }

        const skillNames = developer.skills.map((skillId) => {
            const skill = this.skillsOptions.find((s) => s.id === skillId);
            if (!skill) {
                console.warn(`Skill ID ${skillId} not found in skillsOptions`);
            }
            return skill ? skill.name : 'Unknown skill';
        });

        return skillNames.join(', ');
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}