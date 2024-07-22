import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import ipRegex from 'ip-regex';
import { IpService } from '../../../services/ip.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent {
  ipForm!: FormGroup;

  constructor(private fb: FormBuilder, private ipService: IpService) {
    this.ipForm = this.fb.group({
      ip: ['', [Validators.required, this.ipValidator]],
    });
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
    if (this.ipForm.valid) {
      const ip = this.ipForm.get('ip')?.getRawValue();
      this.ipService.newIp(ip);
    }
  }
}
