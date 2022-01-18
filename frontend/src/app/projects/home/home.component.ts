import { Component, OnInit } from '@angular/core';
import { SnackBarService } from 'src/app/shared/snack-bar.service';
import { UsersService } from 'src/app/users.service';
import { Project, ProjectsService } from '../projects.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  projectToEdit: Project = {} as Project;
  showAddProjectModal = false;
  showEditProjectModal = false;
  projects: Project[] = [];
  constructor(
    private snackBar: SnackBarService,
    private usersService: UsersService,
    private projectsService: ProjectsService
  ) {}

  ngOnInit(): void {
    this.getProjects();
  }

  getProjects() {
    this.projectsService.getProjects().subscribe({
      next: (value) => {
        this.projects = value;
        console.log(this.projects);
      },
      error: () => {
        console.log('Error caught!');
      },
    });
  }

  onAddProjectSubmit(value: boolean) {
    let notificationMessage = '';
    if (value === true) {
      notificationMessage = 'Pomyślnie dodano nowy projekt';
    } else {
      notificationMessage = 'Podano błędne dane';
    }
    this.showAddProjectModal = false;
    this.snackBar.openSnackBar(notificationMessage, 'Ok');
    this.ngOnInit();
  }

  onEditProjectSubmit(value: boolean) {
    let notificationMessage = '';
    if (value === true) {
      notificationMessage = 'Pomyślnie zaktualizowano nowy projekt';
    } else {
      notificationMessage = 'Podano błędne dane';
    }
    this.showAddProjectModal = false;
    this.snackBar.openSnackBar(notificationMessage, 'Ok');
    this.ngOnInit();
  }

  onEditClick(project: Project) {
    this.projectToEdit = project;
    this.showEditProjectModal = true;
  }
}
