import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class EmployeeService {


  constructor(private http:HttpClient) { }

  GetAllEmployees():Observable<any>
  {
    return this.http.get("https://localhost:7185/api/Employee")
  }

  AddEmployee(employee:any):Observable<any>
  {
    return this.http.post("https://localhost:7185/api/Employee", employee)
  }

  UpdateEmployee(empId:number ,employee:any):Observable<any>
  {
    return this.http.put("https://localhost:7185/api/Employee?empId=" + empId, employee)
  }

  DeleteEmployee(empId:number):Observable<any>
  {
    return this.http.delete("https://localhost:7185/api/Employee/DeleteEmployee/?empId=" + empId)
  }

  DeleteListOfEmployee(empIds:number[]):Observable<any>
  {
    return this.http.delete("https://localhost:7185/api/Employee/DeleteListOfEmployee", {body: empIds})
  }

  // DownloadEmployeeFile(empId:number):Observable<any>
  // {
  //   return this.http.get('https://localhost:7185/api/Employee/DownloadFile', { params: { empId: empId.toString() }, responseType: 'arraybuffer' })
  // }

  DownloadEmployeeFile(fileName:string):Observable<any>
  {
    return this.http.get('https://localhost:7185/api/Employee/DownloadFile/' + fileName, { responseType: 'blob' })
  }

  downloadEmployeeFile(employeeId: number): Observable<Blob> {
    return this.http.get(`https://localhost:7185/api//Employees/${employeeId}/file`, {
      responseType: 'blob'
    });
  }

}
