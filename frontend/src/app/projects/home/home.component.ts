import { Component, OnDestroy, OnInit } from '@angular/core';
import { SnackBarService } from 'src/app/shared/snack-bar.service';
import { UsersService } from 'src/app/users.service';
import { WebsocketService } from 'src/app/websocket.service';
import { Project, ProjectsService } from '../projects.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  projectToEdit: Project = {} as Project;
  projectIdToDelete!: string;
  showAddProjectModal = false;
  showEditProjectModal = false;
  showDeleteProjectModal = false;

  constructor(
    private snackBar: SnackBarService,
    private usersService: UsersService,
    public projectsService: ProjectsService,
    private webSocketService: WebsocketService
  ) {}

  ngOnInit(): void {
    this.getProjects();
    this.webSocketService.openWebSocket();
  }

  getProjects() {
    this.projectsService.getProjects().subscribe({
      next: (value) => {
        this.projectsService.projects = value;
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
    this.showEditProjectModal = false;
    this.snackBar.openSnackBar(notificationMessage, 'Ok');
    this.ngOnInit();
  }

  onEditClick(project: Project) {
    this.projectToEdit = project;
    this.showEditProjectModal = true;
  }

  onDeleteClick(projectId: string) {
    this.projectsService.deleteProject(projectId).subscribe({
      next: () => {
        this.snackBar.openSnackBar('Pomyślnie usunięto projekt', 'OK');
      },
      error: () => {
        this.snackBar.openSnackBar(
          'Nastąpił błąd podczas usuwania projektu',
          'OK'
        );
      },
    });
    this.ngOnInit();
    this.showDeleteProjectModal = false;
  }
}
