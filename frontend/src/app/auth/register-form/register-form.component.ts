import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css'],
})
export class RegisterFormComponent implements OnInit {
  @Output() onRegister = new EventEmitter<boolean>();

  registerGroupForm = new FormGroup({
    login: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(25),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20),
    ]),
    passwordConfirm: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20),
    ]),
  });

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  onSubmit() {
    if (this.registerGroupForm.invalid) {
      return;
    }

    this.authService.signIn(this.registerGroupForm.value).subscribe({
      next: () => {
        this.onRegister.emit(true);
      },
      error: ({ error }) => {
        if (error.username || error.password || error.passwordConfirm) {
          this.registerGroupForm.setErrors({ credentials: true });
        }
        this.onRegister.emit(false);
      },
    });
  }
}
