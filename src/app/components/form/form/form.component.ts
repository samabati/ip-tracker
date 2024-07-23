import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import ipRegex from 'ip-regex';
import { IpService } from '../../../services/ip.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent implements OnInit {
  ipForm!: FormGroup;
  error$!: Observable<boolean>;

  constructor(private fb: FormBuilder, private ipService: IpService) {
    this.ipForm = this.fb.group({
      ip: ['', [Validators.required, this.ipValidator]],
    });
  }

  ngOnInit() {
    this.error$ = this.ipService.error$;
  }

  private ipValidator(control: FormControl): { [key: string]: any } | null {
    if (!control.value) {
      return null; // Let required validator handle empty values
    }

    // Use ip-regex to validate IPv4 addresses
    if (!ipRegex({ exact: true }).test(control.value)) {
      return { invalidIp: true };
    }

    return null;
  }

  submitIp() {
    if (this.ipForm.invalid) {
      this.ipService.errorSubject.next(true);
    } else if (this.ipForm.valid) {
      this.ipService.errorSubject.next(false);
      const ip = this.ipForm.get('ip')?.getRawValue();
      this.ipService.newIp(ip);
    }
  }
}
