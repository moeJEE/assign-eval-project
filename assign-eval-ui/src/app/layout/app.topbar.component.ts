import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from './service/app.layout.service';
import { AuthService } from '@app/core/services/auth.service';
import { MenuItem } from 'primeng/api'; // Import MenuItem for PrimeNG menu

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent implements OnInit {
    isUserMenuVisible: boolean = false; // Tracks the visibility of the user menu
    menuItems: MenuItem[] = []; // Holds the menu items for the dropdown

    @ViewChild('menubutton', { static: true }) menuButton!: ElementRef;
    @ViewChild('topbarmenubutton', { static: true }) topbarMenuButton!: ElementRef;
    @ViewChild('topbarmenu', { static: false }) menu!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.menuItems = [
            {
                label: 'Profile',
                icon: 'pi pi-user',
                command: () => {
                    console.log('Profile clicked');
                },
            },
            {
                label: 'Settings',
                icon: 'pi pi-cog',
                routerLink: '/documentation', // Update with your actual settings route
            },
            {
                separator: true,
            },
            {
                label: 'Logout',
                icon: 'pi pi-sign-out',
                command: () => {
                    this.logout();
                },
            },
        ];
    }

    /**
     * Toggles the visibility of the user menu.
     */
    toggleUserMenu(): void {
        this.isUserMenuVisible = !this.isUserMenuVisible;
    }

    /**
     * Logs out the user by calling the AuthService and navigating to the login page.
     */
    logout(): void {
        this.authService.logout();
        this.isUserMenuVisible = false; // Hide the dropdown menu
        this.router.navigate(['/auth/login']); // Redirect to the login page
    }
}
