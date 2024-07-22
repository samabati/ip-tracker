import { Component, OnDestroy, OnInit } from '@angular/core';
import { IpService } from '../../../services/ip.service';
import { ipInfo } from '../../../models/ipInfo';
import { CommonModule } from '@angular/common';
import { pipe, map, Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './display.component.html',
  styleUrl: './display.component.css',
})
export class DisplayComponent implements OnInit, OnDestroy {
  ipInfo$!: ipInfo;

  subscription!: Subscription;

  constructor(private ipService: IpService) {}

  ngOnInit(): void {
    this.subscription = this.ipService.ipInfo$.subscribe((value) => {
      this.ipInfo$ = value;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
