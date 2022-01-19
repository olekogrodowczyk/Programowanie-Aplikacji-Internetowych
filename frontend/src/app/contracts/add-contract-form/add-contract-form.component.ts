import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Person, PersonsService } from 'src/app/persons/persons.service';
import { Project, ProjectsService } from 'src/app/projects/projects.service';
import { SnackBarService } from 'src/app/shared/snack-bar.service';
import { UsersService } from 'src/app/users.service';
import { AddContractCredentials, ContractsService } from '../contracts.service';

@Component({
  selector: 'app-add-contract-form',
  templateUrl: './add-contract-form.component.html',
  styleUrls: ['./add-contract-form.component.css'],
})
export class AddContractFormComponent implements OnInit {
  persons: Person[] = [];
  projects: Project[] = [];
  @Output() onAdd = new EventEmitter<boolean>();
  addContractForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    payment: new FormControl('', [Validators.required]),
    person: new FormControl('', [Validators.required]),
    project: new FormControl('', [Validators.required]),
    startTime: new FormControl('', [Validators.required]),
    endTime: new FormControl('', [Validators.required]),
  });

  constructor(
    private personsService: PersonsService,
    private projectsService: ProjectsService,
    private contractsService: ContractsService
  ) {}

  ngOnInit(): void {
    this.loadPersons();
    this.loadProjects();
  }

  loadPersons() {
    this.personsService.getPersons().subscribe({
      next: (value) => {
        this.persons = value;
        console.log(this.persons);
      },
      error: () => {
        console.log('Error caught!');
      },
    });
  }

  loadProjects() {
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

  createContractToSend() {
    const projectId: string =
      this.addContractForm.controls['project'].value._id;
    const contractorId = this.addContractForm.controls['person'].value._id;

    const project: AddContractCredentials = {
      projectId: projectId,
      contractorId: contractorId,
      name: this.addContractForm.controls['name'].value,
      payment: this.addContractForm.controls['payment'].value,
      startTime: new Date(
        this.addContractForm.controls['startTime'].value
      ).getTime(),
      endTime: new Date(
        this.addContractForm.controls['endTime'].value
      ).getTime(),
    };
    return project;
  }

  onSubmit() {
    if (this.addContractForm.invalid) {
      console.log('Invalid form');
      return;
    }
    let contract = this.createContractToSend();

    this.contractsService.addContract(contract).subscribe({
      next: () => {
        this.onAdd.emit(true);
      },
      error: ({ cause }) => {
        this.addContractForm.setErrors({ credentials: true });
        console.log(cause);
        this.onAdd.emit(false);
      },
    });
  }
}
