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

  UpdateEmployee(employee:any)
  {
    return this.http.put("https://localhost:7185/api/Employee", employee)
  }

  DeleteEmployee(empId:number)
  {
    return this.http.delete("https://localhost:7185/api/EmployeeDeleteEmployee/?empId=" + empId)
  }

  DeleteListOfEmployee(empIds:number[])
  {
    return this.http.delete("https://localhost:7185/api/Employee/DeleteListOfEmployee", {body: empIds})
  }
}