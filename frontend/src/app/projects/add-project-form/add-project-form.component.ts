import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { User, UsersService } from 'src/app/users.service';
import { ProjectsService, AddProjectCredentials } from '../projects.service';

@Component({
  selector: 'app-add-project-form',
  templateUrl: './add-project-form.component.html',
  styleUrls: ['./add-project-form.component.css'],
})
export class AddProjectFormComponent implements OnInit {
  managers: User[] = [];
  disableSelect: boolean = true;
  @Output() onAdd = new EventEmitter<boolean>();
  addProjectForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20),
    ]),
    manager: new FormControl(''),
  });

  constructor(
    private projectsService: ProjectsService,
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.usersService.getUsersByRole('manager').subscribe({
      next: (value) => {
        this.managers = value;
        console.log(this.managers);
      },
      error: () => {
        console.log('Error caught!');
      },
    });
  }

  checkPermission(roles: string[]): boolean {
    return this.authService.checkPermission(roles);
  }

  onSubmit() {
    if (this.addProjectForm.invalid) {
      return;
    }
    console.log(this.authService._id$.getValue());

    const managerId: string = this.checkPermission(['admin'])
      ? this.addProjectForm.controls['manager'].value._id
      : this.authService._id$.getValue();
    const name = this.addProjectForm.controls['name'].value;
    const project: AddProjectCredentials = { managerId: managerId, name: name };
    this.projectsService.addProject(project).subscribe({
      next: () => {
        this.onAdd.emit(true);
      },
      error: ({ cause }) => {
        this.addProjectForm.setErrors({ credentials: true });
        console.log(cause);
        this.onAdd.emit(false);
      },
    });
  }
}
