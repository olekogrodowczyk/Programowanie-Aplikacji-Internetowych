import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
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

  constructor(private transationsService: TransactionsService) {}

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
        default:
          console.log('Unrecognized web socket message');
          break;
      }
      console.log('Data:');
      console.log(data);
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
