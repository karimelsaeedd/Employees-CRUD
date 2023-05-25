import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../service/employee.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-emp-add-edit',
  templateUrl: './emp-add-edit.component.html',
  styleUrls: ['./emp-add-edit.component.scss']
})
export class EmpAddEditComponent implements OnInit {
  constructor(
    private _EmployeeService: EmployeeService,
    private _DialogRef: MatDialogRef<EmpAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  EmployeeForm: FormGroup = new FormGroup({
    'id': new FormControl(0),
    'name': new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
    'email': new FormControl(null, [Validators.required, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/)]),
    'mobile': new FormControl(null, [Validators.required, Validators.pattern(/^(011|012|010)\d{8}$/)]),
    'address': new FormControl(null, [Validators.required])
  });

  EmployeesData: any[] = [];

  getEmployees() {
    this._EmployeeService.GetAllEmployees().subscribe({
      next: (res) => {
        this.EmployeesData = res;
        console.log(res);
      }
    });
  }

  isDuplicateEmail(email: string): boolean {
    return this.EmployeesData.some((existingEmployee) => existingEmployee.email === email);
  }

  isDuplicatePhone(phone: string): boolean {
    return this.EmployeesData.some((existingEmployee) => existingEmployee.mobile === phone);
  }

  submitForm() {
    const button = document.getElementById('SubmitButton');
    button?.setAttribute('disabled', 'true');

    if (this.EmployeeForm.valid) {
      if (this.data) {
        const data = this.EmployeeForm.value;
        const isDuplicateEmail = this.isDuplicateEmail(data.email);
        const isDuplicatePhone = this.isDuplicatePhone(data.mobile);

        if (isDuplicateEmail || isDuplicatePhone) {
          // Handle duplicate email or phone
          alert('Email or phone already exists!');
          button?.removeAttribute('disabled');
        } else {
          this._EmployeeService.UpdateEmployee(data).subscribe((data) => {
            alert('Employee Updated Successfully');
            button?.removeAttribute('disabled');
            console.log(data);
            this._DialogRef.close(true);
          });
        }
      } else {
        const data = this.EmployeeForm.value;
        const isDuplicateEmail = this.isDuplicateEmail(data.email);
        const isDuplicatePhone = this.isDuplicatePhone(data.mobile);

        if (isDuplicateEmail || isDuplicatePhone) {
          // Handle duplicate email or phone
          alert('Email or phone already exists!');
          button?.removeAttribute('disabled');
        } else {
          this._EmployeeService.AddEmployee(data).subscribe((data) => {
            alert('Employee Added Successfully');
            button?.removeAttribute('disabled');
            console.log(data);
            this._DialogRef.close(true);
          });
        }
      }
    }
  }

  ngOnInit(): void {
    this.EmployeeForm.patchValue(this.data);
    this.getEmployees();
  }
}
