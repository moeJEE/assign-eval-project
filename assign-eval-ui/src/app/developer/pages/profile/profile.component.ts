
import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { DeveloperService } from '@app/core/services/developer.service';
import { SkillService } from '@app/core/services/skill.service';
import { RoleService } from '@app/core/services/role.service';
import { MessageService } from 'primeng/api';
import { Developer, Skill, Role, DeveloperPayload } from '@app/models/project.model';
import { ChangeDetectorRef } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-developers',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [MessageService],
})
export class ProfileComponent implements OnInit {

  developerDialog: boolean = false;
  deleteDeveloperDialog: boolean = false;
  deleteDevelopersDialog: boolean = false;


  currentDeveloper: Developer | null = null;
  developers: Developer[] = [];
  selectedDevelopers: Developer[] = [];

  filteredDevelopers: Developer[] = [];



  developer: Developer = this.initializeDeveloper();
  isEditMode: boolean = false;
  submitted: boolean = false;


  skillsOptions: Skill[] = [];


  filterSelectedSkills: number[] = []; 
  formSelectedSkills: number[] = [];


  selectedRoles: number[] = [];
  availableRoles: Role[] = [];
  developerRoleId: number | undefined;

  availableFilter: boolean | null = null;

  availabilityOptions = [
    { label: 'Available', value: true },
    { label: 'Not Available', value: false },
  ];

  rowsPerPageOptions = [5, 10, 20];

  items: any[] = [];

  @ViewChild('developerTable') developerTable!: Table;

  globalFilter: string = '';
  
  constructor(
    private developerService: DeveloperService,
    private skillService: SkillService,
    private roleService: RoleService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit() {
    this.loadSkills();
    this.loadRoles();
    this.loadDevelopers();
    this.initializeBreadcrumb();
  }


  /**
   * Initializes the developer form with default values.
   */
  initializeDeveloper(): Developer {
    return {
      id: 0,
      firstname: '',
      lastname: '',
      email: '',
      portfolio: '',
      skills: [],
      roles: [],
      available: false,
      enabled: true, // Set a default value for `enabled`
      createdAt: new Date().toISOString(),
      avatar: '', // Initialize avatar if necessary
    };
  }

  /**
   * Initializes breadcrumb items.
   */
  initializeBreadcrumb() {
    this.items = [
      { label: 'Developers', routerLink: '/developers' },
      { label: 'Manage Developers' }
    ];
  }

  

/**
 * Loads the authenticated developer based on their email.
 */
loadDevelopers() {
  // Fetch the authenticated developer based on their email (using getDevByEmail)
  this.developerService.getDevByEmail().subscribe({
    next: (developer: Developer) => {
      // Only one developer is fetched, so directly set it to the developers and filtered developers arrays
      this.developers = [developer]; // Wrap the developer in an array as the table expects an array
      this.filteredDevelopers = [developer]; // Update the filtered developers list
    },
    error: (err) => {
      console.error('Error loading authenticated developer:', err);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load authenticated developer.',
        life: 3000,
      });

      // If there's an error, you might want to reset the lists or show a fallback message
      this.developers = [];
      this.filteredDevelopers = [];
    }
  });
}


  
  
/**
 * Helper method to get skill name by ID.
 */
getSkillNameById(skillId: number): string {
  const skill = this.skillsOptions.find(s => s.id === skillId);
  return skill ? skill.name : 'Unknown';
}
  /**
   * Fetches all available skills from the backend.
   */
  loadSkills(): void {
    this.skillService.getAllSkills().subscribe({
      next: (skills: Skill[]) => {
        this.skillsOptions = skills;
        console.log('Skills loaded:', this.skillsOptions);
      },
      error: (error) => {
        console.error('Error loading skills:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load skills. Please try again later.',
        });
      }
    });
  }

  /**
   * Loads all roles from the backend and identifies the 'Developer' role ID.
   */
  loadRoles() {
    this.roleService.getAllRoles().subscribe({
      next: (roles: Role[]) => {
        this.availableRoles = roles;
        console.log('Roles loaded:', this.availableRoles); // Debugging

        // Identify the 'Developer' role ID (case-insensitive)
        const devRole = roles.find(role => role.name.toLowerCase() === 'developer');
        if (devRole) {
          this.developerRoleId = devRole.id;
          console.log('Developer Role ID:', this.developerRoleId);
        } else {
          console.warn('Developer role not found in roles fetched from backend.');
          this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Developer role not found. Developers may not have roles assigned.',
            life: 3000,
          });
        }
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load roles',
          life: 3000,
        });
      },
    });
  }

  /**
   * Extracts and joins skill names for display.
   */
  getSkillNames(skills: { id: number; name?: string }[]): string {
    return skills.map((skill) => skill.name || 'Unknown').join(', ');
  }

  /**
   * Opens the dialog to create a new developer.
   */
  openNew() {
    this.developer = this.initializeDeveloper();
    this.formSelectedSkills = [];
    this.selectedRoles = this.developerRoleId ? [this.developerRoleId] : [];
    this.isEditMode = false;
    this.submitted = false;
    this.developerDialog = true;
  }

  /**
   * Opens the dialog to edit an existing developer.
   */
  editDeveloper(developer: Developer) {
    this.developer = { ...developer };
    
    // Set the formSelectedSkills directly from the developer's skills array by extracting the skillId
    this.formSelectedSkills = developer.skills.map(skill => skill.skillId);  // Map to skillIds
    
    console.log('Developer being edited:', developer);
    console.log('Selected skills:', this.formSelectedSkills);
    console.log('Available skills:', this.skillsOptions);
  
    // Handle roles
    if (this.developerRoleId) {
      this.selectedRoles = [this.developerRoleId];
      this.developer.roles = [this.developerRoleId];
    } else {
      this.selectedRoles = [];
      this.developer.roles = [];
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Developer role ID is not set. Please check the roles configuration.',
        life: 3000,
      });
    }
  
    this.isEditMode = true;
    this.developerDialog = true;
    this.submitted = false;
  }


  

  
}
