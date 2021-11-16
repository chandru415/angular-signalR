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

  constructor(private http: HttpClient) {this.startSignalRConnection();}

  startSignalRConnection = () => {
    this.hubConnection = new SignalR.HubConnectionBuilder()
      .withUrl(this.hubURL)
      .build();

    this.hubConnection
      .start()
      .then(() => console.log(`Connetion Start - ${this.hubURL}`))
      .catch((err) => console.log(`Error while starting connection - ${err}`));
  };
}
