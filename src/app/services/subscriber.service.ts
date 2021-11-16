import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as SignalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class SubscriberService {
  private readonly hubURL = `${environment.signalR_URL}/chart`;
  private hubConnection!: SignalR.HubConnection;

  /** For load balancer settings */
  private srHubOptions: SignalR.IHttpConnectionOptions = {
    skipNegotiation: true,
    transport: 1
  }

  constructor(private http: HttpClient) {this.startSignalRConnection();}

  startSignalRConnection = () => {
    this.hubConnection = new SignalR.HubConnectionBuilder()
      .withUrl(this.hubURL, this.srHubOptions)
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: retryContext => {
          return retryContext.previousRetryCount <= 10 ? Math.random() * 10000 : null
        }
      })
      .build();

    this.hubConnection
      .start()
      .then(() => console.log(`Connetion Start - ${this.hubURL}`))
      .catch((err) => console.log(`Error while starting connection - ${err}`));
  };
}
