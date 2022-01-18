import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectsService } from '../projects.service';

@Component({
  selector: 'app-add-project-form',
  templateUrl: './add-project-form.component.html',
  styleUrls: ['./add-project-form.component.css'],
})
export class AddProjectFormComponent implements OnInit {
  constructor(private projectsService: ProjectsService) {}

  @Output() onAdd = new EventEmitter<boolean>();
  addProjectForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20),
    ]),
  });

  ngOnInit(): void {}

  onSubmit() {
    if (this.addProjectForm.invalid) {
      return;
    }

    this.projectsService.addProject(this.addProjectForm.value).subscribe({
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
