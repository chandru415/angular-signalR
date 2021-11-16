import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriberService {

  private readonly hubURL = `${environment.signalR_URL}/chart`

  constructor(private http: HttpClient) { }
}
