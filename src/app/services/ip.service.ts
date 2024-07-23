import { Injectable } from '@angular/core';
import { ipInfo } from '../models/ipInfo';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class IpService {
  errorSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  error$ = this.errorSubject.asObservable();

  ipInfoSubject!: BehaviorSubject<ipInfo>;
  ipInfo$!: Observable<ipInfo>;

  constructor(private http: HttpClient) {
    const ipInfo: ipInfo = {
      ip: '',
      location: {
        country: '',
        region: '',
        city: '',
        lat: 39.8283,
        lng: -95.7129,
        postalCode: '',
        timezone: '',
      },
      isp: '',
    };

    this.ipInfoSubject = new BehaviorSubject<ipInfo>(ipInfo);
    this.ipInfo$ = this.ipInfoSubject.asObservable();
  }

  newIp(ip: string) {
    this.http
      .get<ipInfo>(
        `https://geo.ipify.org/api/v2/country,city?apiKey=at_I3a27avBjzQAIIQLfrDNaOEH8w6Xg&ipAddress=${ip}`
      )
      .subscribe((value) => {
        this.ipInfoSubject.next(value);
        console.log(this.ipInfoSubject.getValue());
      });
  }
}
