import { Component } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { FormInputComponent } from '../../ui/form-input/form-input.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { CommonModule } from '@angular/common';
import { passwordMatchValidator } from '../../../shared/validators/passwordMatchValidator';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import AOS from 'aos';
import 'aos/dist/aos.css';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormInputComponent,
    ButtonComponent,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
})
export class RegisterFormComponent {
  isSubmitted: boolean = false;
  errorMessage: string = '';
  verifyMessage: string = '';
  ngAfterViewInit(): void {
    AOS.init();
  }
  constructor(private router: Router, private authService: AuthService) {}
  //register inputs as a form group and add validators
  registerForm = new FormGroup(
    {
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
        Validators.pattern(/^[A-Za-z\s]+$/),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: passwordMatchValidator() }
  );

  //helper methods, makes the variables names, emails, ids, accessible in the template for cleaner code instead of accessing form controls itself
  get name() {
    return this.registerForm.controls['name'];
  }

  get email() {
    return this.registerForm.controls['email'];
  }

  get password() {
    return this.registerForm.controls['password'];
  }

  get confirmPassword() {
    return this.registerForm.controls['confirmPassword'];
  }

  onSubmit() {
    if (!this.registerForm.valid) {
      this.registerForm.markAllAsTouched();
      console.log('Form is invalid');
      return;
    }

    console.log('Form is valid');

    const user = {
      name: this.name.value as string,
      email: this.email.value as string,
      password: this.password.value as string,
    };

    console.time('RegisterUser');
    this.authService.registerUser(user).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        this.router.navigate(['/login']);
        localStorage.setItem('verifMessage', response.message);
        this.isSubmitted = true;
        this.errorMessage = '';
      },
      error: (error) => {
        console.timeEnd('RegisterUser');
        console.error('Registration failed', error);
        this.isSubmitted = false;
        if (error.status === 400) {
          if (error.error?.message.includes('Username already exists')) {
            this.errorMessage =
              'Username already exists. Please choose a different username.';
          } else if (error.error?.message.includes('Email already exists')) {
            this.errorMessage =
              'Email already exists. Please use a different email or login.';
          } else if (
            error.error?.message.includes('Please use a valid email address')
          ) {
            this.errorMessage = 'Please provide a valid email address.';
          }
        } else {
          this.errorMessage =
            'Oops! We could not process your request right now, please try again later.';
        }
      },
    });
  }
}
