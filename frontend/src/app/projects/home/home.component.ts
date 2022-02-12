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
export class HomeComponent implements OnInit, OnDestroy {
  projectToEdit: Project = {} as Project;
  showAddProjectModal = false;
  showEditProjectModal = false;

  constructor(
    private snackBar: SnackBarService,
    private usersService: UsersService,
    public projectsService: ProjectsService,
    private webSocketService: WebsocketService
  ) {}

  ngOnDestroy(): void {
    this.webSocketService.closeWebSocket();
  }

  ngOnInit(): void {
    this.webSocketService.openWebSocket();
    this.getProjects();
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
    this.showAddProjectModal = false;
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
  }
}
