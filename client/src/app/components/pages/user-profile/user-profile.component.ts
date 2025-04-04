import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { RescueService } from '../../../services/rescue.service';
import { CommonModule } from '@angular/common';
import { ApplicationCardComponent } from '../../ui/application-card/application-card.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import AOS from 'aos';
import 'aos/dist/aos.css';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    ApplicationCardComponent,
    ButtonComponent,
    MatDialogModule,
    DialogComponent,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  userProfile: any = {};
  userApplications: any[] = [];
  uploadNotification: string = '';
  errorMessage: string = '';

  activeFilter: string = 'all';

  ngAfterViewInit(): void {
    AOS.init();
  }

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  constructor(
    private userService: UserService,
    private rescueService: RescueService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.getUserProfile(userId);
    }
  }

  //to retrieve user's profile on profile component
  getUserProfile(userId: string): void {
    this.userService.getUserProfile(userId).subscribe({
      next: (response) => {
        this.userProfile = response.user || {};
        this.userApplications = response.applications || [];
      },
      error: (error) => {
        console.error('Error retrieving user profile:', error);
        this.errorMessage = 'Failed to load profile. Please try again.';
      },
    });
  }

  deleteUserApplication(applicationId: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: {
        modalTitle: 'Are you sure you want to cancel your application?',
        modalDesc: 'This action cannot be undone.',
        yes: 'Confirm',
        no: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.deleteApplication(applicationId).subscribe({
          next: () => {
            console.log('Application has been deleted successfully');
            const userId = localStorage.getItem('userId');
            if (userId) {
              this.getUserProfile(userId);
            }
          },
          error: (error) => {
            console.error('Error in deleting application: ', error);
            this.errorMessage = ' Something went wrong. Please try again.';
          },
        });
      }
    });
  }

  openFileInput(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  //to update user's profile image
  onFileSelected(event: Event, userId: string): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      const file: File = input.files[0];
      const formData = new FormData();
      formData.append('profileImage', file, file.name);

      this.userService.updateProfileImg(userId, formData).subscribe({
        next: (response) => {
          console.log('Profile image updated:', response);
          this.getUserProfile(userId);
          // this.uploadNotification = 'Profile image updated successfully.';
          this.errorMessage = '';
        },
        error: (error) => {
          console.error('Error updating profile image:', error);
          this.uploadNotification = '';
          this.errorMessage = 'Failed to upload photo. Please try again.';
        },
      });
    }
  }

  filterApplicationsByStatus(status: string, userId: string) {
    this.activeFilter = status;

    if (status === 'all') {
      this.getUserProfile(userId);
    }

    console.log(`fuck you: ${status}`);
    this.userService.getApplicationsByStatus(status, userId).subscribe({
      next: (response) => {
        console.log('filtered');
        this.userApplications = response.applications || [];
      },
      error: (error) => {
        console.error('Error in retrieving user apps');
      },
    });
  }
}
