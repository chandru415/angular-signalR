import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as SignalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubscriberService {
  private readonly hubURL = `${environment.signalR_URL}`;
  private hubConnection!: SignalR.HubConnection;
  connectionState = new BehaviorSubject<string>(
    this.hubConnection ? this.hubConnection.state : 'Not connected'
  );
  signalRMessageData = new BehaviorSubject<any>(null);
  signalRMessageDataCaller = new BehaviorSubject<any>(null);
  signalRMessageDataContinuos = new BehaviorSubject<any>(null);

  /** For load balancer settings */
  private srHubOptions: SignalR.IHttpConnectionOptions = {
    skipNegotiation: true,
    transport: 1,
  };

  constructor(private http: HttpClient) {}

  startRoutedSignalRConnection = (route: string) => {
    this.hubConnection = new SignalR.HubConnectionBuilder()
      .withUrl(`${this.hubURL}/${route}`, this.srHubOptions)
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          return retryContext.previousRetryCount <= 10
            ? Math.random() * 10000
            : null;
        },
      })
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log(`Connection Start - ${this.hubURL}`);
        this.connectionState.next(this.hubConnection.state);
      })
      .catch((err) => {
        console.log(`Error while starting connection - ${err}`);
        this.connectionState.next(this.hubConnection.state);
      });

    this.hubConnection.onclose(() =>
      this.connectionState.next(this.hubConnection.state)
    );
    this.hubConnection.onreconnected(() =>
      this.connectionState.next(this.hubConnection.state)
    );
  };

  subscriptionOnMethod = (method: string) => {
    this.hubConnection.invoke(method).then((data) => {
      this.signalRMessageData.next(data);
    });
  };

  sendDataToServer = (method: string, args?: any) => {
    this.hubConnection.invoke(method, args).then((res) => {
      this.signalRMessageDataCaller.next({...res});
    });
  };

  continuos = (method: string) => {
    this.hubConnection.on(method, (data) => {
      this.signalRMessageDataContinuos.next(data);
    });

    return this.http.get(`https://localhost:44382/api/chart/SendChartData`);
  };
}
