import { Component } from '@angular/core';
import { SubscriberService } from './services/subscriber.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-signalr';

  constructor(private subService: SubscriberService) {}
}
