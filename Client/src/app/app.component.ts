import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EmpAddEditComponent } from './emp-add-edit/emp-add-edit.component';
import { EmployeeService } from './service/employee.service';
import { SelectionModel } from '@angular/cdk/collections';
import { NgxSpinnerService } from 'ngx-spinner';
import { DeleteEmployeeComponent } from './delete-employee/delete-employee.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'select',
    'name',
    'email',
    'address',
    'phone',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;
  selection: any = new SelectionModel(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  /**
   *
   */
  constructor(
    private _dialog: MatDialog,
    private _EmployeeService: EmployeeService,
    private spinner:NgxSpinnerService
  ) {}

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const DialogRef = this._dialog.open(DeleteEmployeeComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
    DialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.deleteSelectedEmployees()
        }
      },
      error: console.log,
      complete:() => {
        this.selection.clear();
      },
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  GetEmployees() {
    this._EmployeeService.GetAllEmployees().subscribe({
      next:(res) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      },
      complete:() => {
          this.spinner.hide();
      },
    });
  }

  openAddEditEmpForm() {
    const DialogRef = this._dialog.open(EmpAddEditComponent);
    DialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.GetEmployees();
        }
      },
      error: console.log,
      complete:() => {
        this.selection.clear();
      },
    });
  }

  openEditEmpForm(data: any) {
    const DialogRef = this._dialog.open(EmpAddEditComponent, {
      data,
    });
    DialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.GetEmployees();
        }
      },
      error: console.log,
      complete:() => {
        this.selection.clear();
      },
    });
  }

  // Deleteemployee(employeeId: number) {
  //     this._EmployeeService.DeleteEmployee(employeeId).subscribe({
  //       next: (res) => {
  //         this.GetEmployees();
  //       },
  //       error: console.log,
  //       complete:() => {
  //         this.selection.clear();
  //       },
  //     });
  // }

  deleteSelectedEmployees()
  {
    const employees = this.selection.selected
    const employeeIds: number[] = employees.map((employee:any) => employee.id);
    console.log(employeeIds);

    this._EmployeeService.DeleteListOfEmployee(employeeIds).subscribe({
        next: (res) => {
          this.GetEmployees();
        },
        error: console.log,
        complete:() => {
          this.selection.clear();
        },
      });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.spinner.show();
    this.GetEmployees();
  }
}
