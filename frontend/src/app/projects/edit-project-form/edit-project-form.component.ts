import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { User, UsersService } from 'src/app/users.service';
import {
  ProjectsService,
  AddProjectCredentials,
  Project,
  EditProjectCredentials,
} from '../projects.service';

@Component({
  selector: 'app-edit-project-form',
  templateUrl: './edit-project-form.component.html',
  styleUrls: ['./edit-project-form.component.css'],
})
export class EditProjectFormComponent implements OnInit {
  managers: User[] = [];
  @Input() projectToEdit: Project = {} as Project;
  @Output() onEdit = new EventEmitter<boolean>();
  editProjectForm: FormGroup = {} as FormGroup;

  constructor(
    private projectsService: ProjectsService,
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.editProjectForm = new FormGroup({
      name: new FormControl(this.projectToEdit.name, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
      ]),
      manager: new FormControl(''),
    });

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
    if (this.editProjectForm.invalid) {
      return;
    }
    const managerId: string = this.checkPermission(['admin'])
      ? this.editProjectForm.controls['manager'].value._id
      : this.authService._id$.getValue();
    const name = this.editProjectForm.controls['name'].value;
    const project: EditProjectCredentials = {
      managerId: managerId,
      name: name,
      _id: this.projectToEdit._id,
    };
    this.projectsService.editProject(project).subscribe({
      next: () => {
        this.onEdit.emit(true);
      },
      error: ({ cause }) => {
        this.editProjectForm.setErrors({ credentials: true });
        console.log(cause);
        this.onEdit.emit(false);
      },
    });
  }
}
