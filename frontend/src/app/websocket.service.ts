import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { Contract, ContractsService } from './contracts/contracts.service';
import { Person, PersonsService } from './persons/persons.service';
import { Project, ProjectsService } from './projects/projects.service';
import {
  DepositRequest,
  TransactionResponse,
  TransactionsService,
} from './transactions/transactions.service';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  webSocket!: WebSocket;
  data: any;

  constructor(
    private transationsService: TransactionsService,
    private projectsService: ProjectsService,
    private contractsService: ContractsService,
    private personsService: PersonsService
  ) {}

  public openWebSocket() {
    this.webSocket = new WebSocket('ws://localhost:7777');

    this.webSocket.onopen = (event) => {
      console.log('Open: ', event);
    };

    this.webSocket.onmessage = (event) => {
      console.log('Message caught');
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'addDeposit':
          this.transationsService.transactions.push(
            data as TransactionResponse
          );
          break;
        case 'addProject':
          this.projectsService.projects.push(data as Project);
          break;
        case 'addContract':
          this.contractsService.contracts.push(data as Contract);
          break;
        case 'addPerson':
          this.personsService.persons.push(data as Person);
          break;
        case 'refreshTransactions':
          this.refreshTransactions();
          break;
        case 'refreshPersons':
          this.refreshPersons();
          break;
        case 'refreshProjects':
          this.refreshProjects();
          break;
        case 'refreshContracts':
          this.refreshContracts();
          break;
        default:
          console.log('Unrecognized web socket message');
          break;
      }
    };

    this.webSocket.onclose = (event) => {
      console.log('Close: ', event);
    };
  }

  public sendDeposit(model: DepositRequest) {
    this.webSocket.send(JSON.stringify(model));
  }

  public closeWebSocket() {
    this.webSocket.close();
  }

  public refreshTransactions() {
    this.transationsService.getAllTransactions().subscribe({
      next: (response) => {
        this.transationsService.transactions = response;
      },
      error: () => {
        console.log(
          'An unexptected error has occured while refreshing transactions by web socket'
        );
      },
    });
  }

  public refreshPersons() {
    this.personsService.getPersons().subscribe({
      next: (response) => {
        this.personsService.persons = response;
      },
      error: () => {
        console.log(
          'An unexptected error has occured while refreshing persons by web socket'
        );
      },
    });
  }

  public refreshProjects() {
    this.projectsService.getProjects().subscribe({
      next: (response) => {
        this.projectsService.projects = response;
      },
      error: () => {
        console.log(
          'An unexptected error has occured while refreshing projects by web socket'
        );
      },
    });
  }

  public refreshContracts() {
    this.contractsService.getContracts().subscribe({
      next: (response) => {
        this.contractsService.contracts = response;
      },
      error: () => {
        console.log(
          'An unexptected error has occured while refreshing contracts by web socket'
        );
      },
    });
  }
}
