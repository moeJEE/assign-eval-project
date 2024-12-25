
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
  templateUrl: './developers.component.html',
  styleUrls: ['./developers.component.css'],
  providers: [MessageService],
})
export class DevelopersComponent implements OnInit {

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
      enabled: true,
      createdAt: new Date().toISOString(),
      avatar: '',
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

  applyGlobalFilter() {
    const value = this.globalFilter.trim().toLowerCase();
  
    if (value) {
      this.filteredDevelopers = this.developers.filter(developer =>
        developer.firstname.toLowerCase().includes(value) ||
        developer.lastname.toLowerCase().includes(value) ||
        developer.email.toLowerCase().includes(value) ||
        developer.available.toString().includes(value) ||
        developer.createdAt.toString().includes(value)
      );
    } else {
      this.filteredDevelopers = [...this.developers];
    }
  
    this.cdr.detectChanges();
  }
  

/**
 * Loads developers based on selected skills or fetches all developers if no filter is applied.
 */
loadDevelopers() {

  const developerObservable = this.filterSelectedSkills.length > 0
    ? this.developerService.getDevelopersBySkills(this.filterSelectedSkills)
    : this.developerService.getAllDevelopers();

  developerObservable.subscribe({
    next: (developers: Developer[]) => {

      this.developers = [...developers];
      this.filteredDevelopers = [...developers];

      this.applyGlobalFilter();
    },
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
  
  /**
   * Opens the dialog to confirm deletion of a developer.
   */
  deleteDeveloper(developer: Developer) {
    this.currentDeveloper = developer;
    this.deleteDeveloperDialog = true;
  }

  /**
   * Confirms the deletion of a single developer.
   */
  confirmDelete() {
    if (this.currentDeveloper && this.currentDeveloper.id) {
      this.developerService.deleteDeveloper(this.currentDeveloper.id).subscribe({
        next: () => {
          this.developers = this.developers.filter(d => d.id !== this.currentDeveloper!.id);
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Developer Deleted',
            life: 3000,
          });
          this.developerDialog = false;
          this.resetForm();
          this.cdr.detectChanges(); // Ensure table updates
        },
        error: (error) => {
          console.error('Error deleting developer:', error);
          const errorMsg = error.error?.validationErrors
            ? error.error.validationErrors.join(', ')
            : 'Failed to delete developer.';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMsg,
            life: 3000,
          });
        },
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Developer not found for deletion.',
        life: 3000,
      });
    }
    this.deleteDeveloperDialog = false;
    this.currentDeveloper = null;
  }

  /**
   * Opens the dialog to confirm deletion of selected developers.
   */
  deleteSelectedDevelopers() {
    this.deleteDevelopersDialog = true;
  }

  /**
   * Confirms the deletion of selected developers.
   */
  confirmDeleteSelected() {
    if (this.selectedDevelopers.length > 0) {
      const deleteObservables: Observable<void>[] = this.selectedDevelopers.map((developer) =>
        this.developerService.deleteDeveloper(developer.id!)
      );
  
      forkJoin(deleteObservables).subscribe({
        next: () => {
          // Clear the selected developers
          this.selectedDevelopers = [];
  
          // Reload developers from the server
          this.loadDevelopers();  // This method fetches the latest developers list
  
          // Show success message
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Selected Developers Deleted',
            life: 3000,
          });
  
          // Manually trigger change detection to ensure UI updates
          this.cdr.detectChanges(); // Ensure Angular detects changes
  
        },
        error: (error) => {
          console.error('Error deleting selected developers:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete selected developers',
            life: 3000,
          });
        },
      });
    }
    this.deleteDevelopersDialog = false;
  }
  

/**
 * Saves (creates or updates) a developer.
 */
saveDeveloper() {
  this.submitted = true;

  if (
    this.developer.firstname?.trim() &&
    this.developer.lastname?.trim() &&
    this.developer.email?.trim() &&
    this.developer.password?.trim() &&
    this.formSelectedSkills.length > 0 &&
    this.developerRoleId
  ) {
    // Create a payload that matches the DeveloperPayload interface
    const payload: DeveloperPayload = {
      firstname: this.developer.firstname.trim(),
      lastname: this.developer.lastname.trim(),
      email: this.developer.email.trim(),
      password: this.developer.password.trim(),
      roleIds: [this.developerRoleId],
      skills: [...this.formSelectedSkills],
      available: this.developer.available ?? false,
      enabled: true,
      portfolio: this.developer.portfolio?.trim() || ''
    };
    

    console.log('Payload being sent to the API:', payload);

    const saveObservable = this.developer.id
      ? this.developerService.updateDeveloper(this.developer.id, payload as unknown as Developer)
      : this.developerService.createDeveloper(payload as unknown as Developer);

    saveObservable.subscribe({
      next: (response: Developer) => {
        console.log('API response:', response);
        if (this.developer.id) {
          const index = this.developers.findIndex((dev) => dev.id === response.id);
          if (index !== -1) this.developers[index] = response;
        } else {
          this.developers.push(response);
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Developer ${this.developer.id ? 'updated' : 'created'} successfully.`,
        });
        this.developerDialog = false;
        this.resetForm();
      },
      error: (error) => {
        console.error('Error saving developer:', error);
        let errorMessage = 'Failed to save developer: ';
        if (error.error?.validationErrors) {
          errorMessage += Object.values(error.error.validationErrors).join(', ');
        } else if (error.error?.message) {
          errorMessage += error.error.message;
        } else {
          errorMessage += 'An unexpected error occurred';
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
        });
      },
    });
  } else {
    this.messageService.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: 'Please fill in all required fields.',
    });
  }
}




  /**
   * Resets the developer form to its initial state.
   */
  resetForm() {
    this.developer = this.initializeDeveloper();
    this.formSelectedSkills = [];
    this.selectedRoles = this.developerRoleId ? [this.developerRoleId] : [];
    this.isEditMode = false;
    this.submitted = false;
  }

  /**
   * Hides the developer dialog and resets the form.
   */
  hideDialog(): void {
    this.developerDialog = false;
    this.resetForm();
  }



/**
 * Applies filters to the developers table based on selected skills and availability.
 */
applyFilters() {
  // If there are selected skills, filter developers based on those skills
  let filterSkillsObservable: Observable<Developer[]>;
  
  if (this.filterSelectedSkills.length > 0) {
    // Fetch developers filtered by selected skills
    filterSkillsObservable = this.developerService.getDevelopersBySkills(this.filterSelectedSkills);
  } else {
    // If no skills filter, fetch all developers
    filterSkillsObservable = this.developerService.getAllDevelopers();
  }

  filterSkillsObservable.subscribe({
    next: (developers: Developer[]) => {
      console.log('Filtered Developers by Skills:', developers);

      // Filter the developers based on the availability filter
      if (this.availableFilter) {
        developers = developers.filter(developer => developer.available === this.availableFilter);
      }

      // Update the developers and filtered developers lists
      this.developers = [...developers];
      this.filteredDevelopers = [...developers];

      // Reapply global filter after filtering
      this.applyGlobalFilter();
    },
    error: (error) => {
      console.error('Error loading developers:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load developers by skills and availability',
      });
    }
  });
}



  /**
   * Clears all filters from the developers table.
   */
  clearFilters() {
    this.availableFilter = null;
    this.filterSelectedSkills = [];
    // No role filters to clear since roles are assigned automatically
    if (this.developerTable) {
      this.developerTable.clear();
    }
    this.cdr.detectChanges(); // Ensure table updates
  }

  /**
   * Handles global search filtering.
   */
  onGlobalFilter(event: any): void {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (this.developerTable) {
      this.developerTable.filterGlobal(value, 'contains');
    }
  }

  

  
}
