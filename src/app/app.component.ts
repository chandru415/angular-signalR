import { Component, OnInit } from '@angular/core';
import { SubscriberService } from './services/subscriber.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'angular-signalr';
  connectionState: any;
  routePath = '';
  messageData = null;
  signalRMessageDataCaller = null;
  stronglyMethodToSubscribe = '';
  methodToSubscribe = 'transferchartdata';
  methodToCall = '';
  paramsBody = '';
  signalRMessageDataContinuos: any;

  constructor(private subService: SubscriberService) {}

  ngOnInit(): void {
    this.subService.signalRMessageData.subscribe(
      (data) => (this.messageData = data)
    );
    this.subService.connectionState.subscribe(
      (data) => (this.connectionState = data)
    );
    this.subService.signalRMessageDataCaller.subscribe(
      (data) => (this.signalRMessageDataCaller = data)
    );
    this.subService.signalRMessageDataContinuos.subscribe(
      (data) => (this.signalRMessageDataContinuos = data)
    );
  }

  connect = () => {
    this.subService.startRoutedSignalRConnection(this.routePath);
  };

  receive = () => {
    this.subService.subscriptionOnMethod(this.stronglyMethodToSubscribe);
  };

  callSever = () => {
    this.subService.sendDataToServer(this.methodToCall,JSON.parse(this.paramsBody.toString()));
  };

  continuos = () => {
    this.subService.continuos(this.methodToSubscribe).subscribe();
  };

  getAlert = () => {
    switch (this.connectionState.toLowerCase()) {
      case 'not connected':
        return { 'alert-warning': true };

      case 'connected':
        return { 'alert-success': true };
      case 'disconnected':
        return { 'alert-danger': true };

      default:
        return { 'alert-info': true };
    }
  };
}
