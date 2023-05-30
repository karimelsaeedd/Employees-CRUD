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

  EmployeeForm!: FormGroup; // Declare the EmployeeForm property

  initializeForm(): void {
    if (this.data) {
      this.EmployeeForm = new FormGroup({
        'id': new FormControl(this.data.id),
        'name': new FormControl(this.data.name, [Validators.required, Validators.minLength(3), Validators.maxLength(40)]),
        'email': new FormControl(this.data.email, [Validators.required, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/)]),
        'mobile': new FormControl(this.data.mobile, [Validators.required, Validators.pattern(/^(011|012|010)\d{8}$/)]),
        'address': new FormControl(this.data.address, [Validators.required]),
        'file': new FormControl(null)
      });
    } else {
      this.EmployeeForm = new FormGroup({
        'id': new FormControl(0),
        'name': new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(40)]),
        'email': new FormControl(null, [Validators.required, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/)]),
        'mobile': new FormControl(null, [Validators.required, Validators.pattern(/^(011|012|010)\d{8}$/)]),
        'address': new FormControl(null, [Validators.required]),
        'file': new FormControl(null, Validators.required)
      });
    }
  }

  EmployeesData: any[] = [];

  formdata:FormData = new FormData;
  selectedEmployeeId!: number;
  selectedFile!: File;
  fileDataUrl: string | null = null; // Variable to store the data URL of the file
  fileDisplayName: string | null = null; // Variable to store the display name of the file


  // ...

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    console.log(this.selectedFile);

  }


  getEmployees() {
    this._EmployeeService.GetAllEmployees().subscribe({
      next: (res) => {
        this.EmployeesData = res;
        console.log(res);
      }
    });
  }

isDuplicateEmail(email: string, employeeId: number): boolean {
  return this.EmployeesData.some(
    (existingEmployee) => existingEmployee.email === email && existingEmployee.id !== employeeId
  );
}

isDuplicatePhone(phone: string, employeeId: number): boolean {
  return this.EmployeesData.some(
    (existingEmployee) => existingEmployee.mobile === phone && existingEmployee.id !== employeeId
  );
}


  submitForm() {
    // console.log(this.selectedFile.name);

    const button = document.getElementById('SubmitButton');
    button?.setAttribute('disabled', 'true');

    if (this.EmployeeForm.valid) {
      if (this.data) {
        const data = this.EmployeeForm.value;

        const formData = new FormData();
        formData.append('name', this.EmployeeForm.get('name')?.value);
        formData.append('email', this.EmployeeForm.get('email')?.value);
        formData.append('mobile', this.EmployeeForm.get('mobile')?.value);
        formData.append('address', this.EmployeeForm.get('address')?.value);
        formData.append('file', this.selectedFile);
        formData.append('fileName', this.selectedFile.name);


        console.log(formData);


        const isDuplicateEmail = this.isDuplicateEmail(data.email, data.id);
        const isDuplicatePhone = this.isDuplicatePhone(data.mobile, data.id);

        if (isDuplicateEmail || isDuplicatePhone) {
          // Handle duplicate email or phone
          alert('Email or phone already exists!');
          button?.removeAttribute('disabled');
        } else {
          this._EmployeeService.UpdateEmployee(data.id ,formData).subscribe((data) => {
            alert('Employee Updated Successfully');
            button?.removeAttribute('disabled');
            console.log("formdata", formData);

            console.log(data);
            this._DialogRef.close(true);
          });
        }
      } else {
        const data = this.EmployeeForm.value;
        const formData = new FormData();
        formData.append('name', this.EmployeeForm.get('name')?.value);
        formData.append('email', this.EmployeeForm.get('email')?.value);
        formData.append('mobile', this.EmployeeForm.get('mobile')?.value);
        formData.append('address', this.EmployeeForm.get('address')?.value);
        formData.append('file', this.selectedFile);
        formData.append('fileName', this.selectedFile.name);

        const isDuplicateEmail = this.isDuplicateEmail(data.email, data.id);
        const isDuplicatePhone = this.isDuplicatePhone(data.mobile, data.id);

        if (isDuplicateEmail || isDuplicatePhone) {
          // Handle duplicate email or phone
          alert('Email or phone already exists!');
          button?.removeAttribute('disabled');
        } else {
          this._EmployeeService.AddEmployee(formData).subscribe((data) => {
            alert('Employee Added Successfully');
            button?.removeAttribute('disabled');
            console.log(data);
            this._DialogRef.close(true);
          });
        }
      }
    }
  }


  // downloadFile(employeeId: number) {
  //   this._EmployeeService.downloadEmployeeFile(employeeId).subscribe({
  //     next:(fileBlob: Blob) => {
  //       console.log("fileBolb",fileBlob);

  //       // Create a temporary URL for the file
  //       const fileUrl = URL.createObjectURL(fileBlob);

  //       // Use the URL to initiate the download
  //       const link = document.createElement('a');
  //       link.href = fileUrl;
  //       link.download = "https://localhost:7185/api/Employee/DownloadFile/" + this.data.fileName;
  //       link.click();

  //       // Clean up the temporary URL
  //       URL.revokeObjectURL(fileUrl);
  //     },
  //     error:(error) => {
  //       console.error('Error downloading employee file:', error);
  //     }
  //   });
  // }

  ViewFile() {
      this._EmployeeService.DownloadEmployeeFile(this.data.fileName).subscribe({
        next: (fileData: Blob) => {
          const file = new File([fileData], this.data.fileName);
          if (file) {
            this.data.fileName = file.name;

            // Manually set the type property based on the file extension
            let fileType: string;
            if (this.data.fileName.endsWith('.pdf')) {
              fileType = 'application/pdf';
            } else if (this.data.fileName.endsWith('.txt')) {
              fileType = 'text/plain';
            } else {
              // Set a default type if the file extension is unknown
              fileType = 'application/octet-stream';
            }

            // Create a new File object with the updated type
            this.selectedFile = new File([file], this.data.fileName, { type: fileType });
          }
          console.log("FILE", this.selectedFile);
        }
      });
  }


  // selectFile() {
  //   const fileInput = document.getElementById('file') as HTMLInputElement;
  //   fileInput.click();
  // }


  ngOnInit(): void {
    this.initializeForm();
    if(this.data)
    {
    this.EmployeeForm.patchValue(this.data);
    this.getEmployees();
    // this.selectedFile = this.data.file;
    // this.downloadFile(this.data.id)
    this.ViewFile();
    }


  }
}
