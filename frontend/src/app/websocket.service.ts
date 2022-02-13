import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { AuthService } from './auth/auth.service';
import { Contract, ContractsService } from './contracts/contracts.service';
import { Person, PersonsService } from './persons/persons.service';
import { Project, ProjectsService } from './projects/projects.service';
import {
  DepositRequest,
  TransactionResponse,
  TransactionsService,
} from './transactions/transactions.service';

export enum TypeOfRefresh {
  Persons = 1,
  Transactions,
  Projects,
  Contracts,
}

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
    if (!this.webSocket || this.webSocket?.readyState === WebSocket.CLOSED) {
      this.webSocket = new WebSocket('ws://localhost:7777');
    }

    this.webSocket.onopen = (event) => {
      console.log('Open: ', event);
      let message = { type: 'init', session: this.getCookieSessionId() };
      console.log(message);
      this.webSocket.send(JSON.stringify(message));
    };

    this.webSocket.onmessage = (event) => {
      console.log('Message caught');
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'refreshTransactions':
          console.log('refreshTransactions message caught');
          this.refreshTransactions();
          break;
        case 'refreshPersons':
          console.log('refreshPersons message caught');
          this.refreshPersons();
          break;
        case 'refreshProjects':
          console.log('refreshProjects message caught');
          this.refreshProjects();
          break;
        case 'refreshContracts':
          console.log('refreshContracts message caught');
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

  public getCookie(name: string) {
    let matches = document.cookie.match(
      new RegExp(
        '(?:^|; )' +
          name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
          '=([^;]*)'
      )
    );
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  public getCookieSessionId() {
    let cookie = this.getCookie('session');
    return cookie;
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
