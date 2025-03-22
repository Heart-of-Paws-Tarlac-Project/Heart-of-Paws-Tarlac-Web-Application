import { Component, AfterViewInit } from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import { FormInputComponent } from '../../ui/form-input/form-input.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { CommonModule } from '@angular/common';
import { RescueService } from '../../../services/rescue.service';
import { Router } from '@angular/router';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import AOS from 'aos';
import 'aos/dist/aos.css';

@Component({
  selector: 'app-create-rescue-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormInputComponent,
    ButtonComponent,
    CommonModule,
  ],
  templateUrl: './create-rescue-form.component.html',
  styleUrl: './create-rescue-form.component.css',
})
export class CreateRescueFormComponent implements AfterViewInit {
  isMale: boolean = false;
  isFemale: boolean = false;

  createForm = new FormGroup({
    name: new FormControl({ value: '', disabled: false }, [
      Validators.minLength(3),
      Validators.pattern(/^[A-Za-z\s]+$/),
      Validators.maxLength(20),
      Validators.required,
    ]),
    sex: new FormControl({ value: '', disabled: false }, Validators.required),
    ageValue: new FormControl({ value: '', disabled: false }, [
      Validators.required,
      Validators.min(1),
      Validators.pattern(/^[0-9]+$/),
    ]),
    ageUnit: new FormControl(
      { value: '', disabled: false },
      Validators.required
    ),
    size: new FormControl({ value: '', disabled: false }, Validators.required),
    vetStatus: new FormControl({ value: '', disabled: false }, [
      Validators.minLength(3),
      Validators.pattern(/^[A-Za-z\s]+$/),
      Validators.maxLength(10),
      Validators.required,
    ]),
    description: new FormControl({ value: '', disabled: false }, [
      Validators.minLength(10),
      Validators.pattern(/^[A-Za-z\s]+$/),
      Validators.maxLength(50),
      Validators.required,
    ]),
    featuredImage: new FormControl<File | null>(
      { value: null, disabled: false },
      Validators.required
    ),
    galleryImages: new FormControl<File[]>({ value: [], disabled: false }, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(4),
    ]),
  });

  ngAfterViewInit(): void {
    AOS.init();
  }

  constructor(
    private rescueService: RescueService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  onSexChange(selectedSex: string) {
    this.isMale = selectedSex === 'male';
    this.isFemale = selectedSex === 'female';

    this.createForm.patchValue({
      vetStatus: '',
    });
  }

  get name() {
    return this.createForm.controls['name'];
  }

  get sex() {
    return this.createForm.controls['sex'];
  }

  get size() {
    return this.createForm.controls['size'];
  }

  get vetStatus() {
    return this.createForm.controls['vetStatus'];
  }

  get description() {
    return this.createForm.controls['description'];
  }

  get featuredImage() {
    return this.createForm.controls['featuredImage'];
  }

  get galleryImages() {
    return this.createForm.controls['galleryImages'];
  }

  handleFeatureImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.createForm.patchValue({
        featuredImage: file,
      });
    }
  }

  handleGalleryImagesUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      this.createForm.patchValue({
        galleryImages: files,
      });
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  createFormData(form: { [key: string]: any }) {
    const newRescue = new FormData();
    Object.entries(this.createForm.value).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (key === 'featuredImage' && value instanceof File) {
          newRescue.append('featuredImage', value, value.name);
        } else if (key === 'galleryImages' && Array.isArray(value)) {
          value.forEach((file: File) => {
            if (file instanceof File) {
              newRescue.append('galleryImages', file, file.name);
            }
          });
        } else {
          newRescue.append(key, String(value));
        }
      }
    });

    const ageValue = this.createForm.controls['ageValue'].value;
    const ageUnit = this.createForm.controls['ageUnit'].value;
    if (ageValue && ageUnit) {
      newRescue.append('age', `${ageValue} ${ageUnit} old`);
    }

    return newRescue;
  }

  confirmSubmission(event: Event) {
    event.preventDefault();

    if (this.createForm.invalid) {
      this.markFormGroupTouched(this.createForm);
      return;
    }

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: {
        modalTitle: 'Confirm Submission',
        modalDesc: 'Are you sure you want to create this rescue?',
        yes: 'Confirm',
        no: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.submitForm();
      }
    });
  }

  submitForm() {
    this.rescueService
      .addRescue(this.createFormData(this.createForm.value))
      .subscribe({
        next: () => {
          alert('Rescue successfully created');
          this.router.navigate(['/admin']);
        },
        error: (error) => {
          console.error('Error in creating rescue: ', error);
          alert('Rescue could not be created right now. Please try again.');
          this.router.navigate(['/admin']);
        },
      });
  }
}
