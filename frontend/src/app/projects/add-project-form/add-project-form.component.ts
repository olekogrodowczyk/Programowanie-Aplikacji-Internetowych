import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User, UsersService } from 'src/app/users.service';
import { ProjectsService, AddProjectCredentials } from '../projects.service';

@Component({
  selector: 'app-add-project-form',
  templateUrl: './add-project-form.component.html',
  styleUrls: ['./add-project-form.component.css'],
})
export class AddProjectFormComponent implements OnInit {
  managers: User[] = [];
  @Output() onAdd = new EventEmitter<boolean>();
  addProjectForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20),
    ]),
    manager: new FormControl('', [Validators.required]),
  });

  constructor(
    private projectsService: ProjectsService,
    private usersService: UsersService
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

  onSubmit() {
    if (this.addProjectForm.invalid) {
      return;
    }
    const managerId: string = this.addProjectForm.controls['manager'].value._id;
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
