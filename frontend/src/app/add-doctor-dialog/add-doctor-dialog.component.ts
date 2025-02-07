import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-add-doctor-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, // Import this module
    MatFormFieldModule, // For mat-form-field
    MatInputModule,     // For matInput
    MatDialogModule
  ],
  templateUrl: './add-doctor-dialog.component.html',
  styleUrls: ['./add-doctor-dialog.component.scss'],
})
export class AddDoctorDialogComponent {
  addDoctorForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddDoctorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.addDoctorForm = this.fb.group({
      name: ['', Validators.required],
      specialization: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contactNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      hospital: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.addDoctorForm.valid) {
      console.log('Form Submitted:', this.addDoctorForm.value);
      this.dialogRef.close(this.addDoctorForm.value); // Pass form data back to parent
    }
  }

  ngOnInit(): void {
    if (this.data.doctor) {
      this.addDoctorForm.patchValue(this.data.doctor); // Pre-fill form for update
    }
  }
}
