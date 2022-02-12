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
        case 'deposit':
          this.transationsService.transactions.push(
            data as TransactionResponse
          );
          break;
        case 'project':
          this.projectsService.projects.push(data as Project);
          break;
        case 'contract':
          this.contractsService.contracts.push(data as Contract);
          break;
        case 'person':
          this.personsService.persons.push(data as Person);
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
}
