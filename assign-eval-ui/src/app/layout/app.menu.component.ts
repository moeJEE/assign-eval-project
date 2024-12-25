import { Component, OnInit } from '@angular/core';
import { LayoutService } from '@app/layout/service/app.layout.service';
import { AuthService } from '@app/core/services/auth.service'; // Assuming you have a service to get user details

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
  model: any[] = [];
  userRole: string = 'PROJECT_MANAGER'; // Default role if getUserRole returns null

  constructor(
    public layoutService: LayoutService,
    private authService: AuthService  // Injecting the AuthService to check the role
  ) {}

  ngOnInit() {
    // Get user role, fallback to 'PROJECT_MANAGER' if null
    this.userRole = this.authService.getUserRole() || 'PROJECT_MANAGER';

    // Dynamically adjust menu items based on user role
    this.model = [
      {
        label: 'Home',
        items: [
          {
            label: 'Dashboard',
            icon: 'pi pi-fw pi-home',
            // Adjust dashboard route based on user role
            routerLink: this.userRole === 'DEVELOPER' 
              ? ['/developer-dashboard'] // Developer's dashboard
              : ['/project-manager-dashboard'], // Project Manager's dashboard
            routerLinkActiveOptions: { exact: true },
          },
        ],
      },
      {
        label: 'Pages',
        icon: 'pi pi-fw pi-briefcase',
        items: [
          {
            label: 'Projects',
            icon: 'pi pi-fw pi-briefcase',
            routerLink: this.userRole === 'DEVELOPER'
              ? ['/developer/projects']
              : ['/project-manager/pages/projects'],
            routerLinkActiveOptions: { exact: false },
          },
          // Conditional items based on user role
          ...(this.userRole === 'DEVELOPER'
            ? [
              {
                label: 'My Profile',
                icon: 'pi pi-fw pi-user',
                routerLink: ['/developer/my-profile'],
                routerLinkActiveOptions: { exact: false },
              }
              ]
            : [
                {
                  label: 'Developers',
                  icon: 'pi pi-fw pi-code',
                  routerLink: ['/project-manager/pages/developers'],
                  routerLinkActiveOptions: { exact: false },
                },
              ]),
        ],
      },
    ];
  }
}
