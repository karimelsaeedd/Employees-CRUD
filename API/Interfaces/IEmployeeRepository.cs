using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
    public interface IEmployeeRepository
    {
        Task<IReadOnlyList<EmployeeToReturnDTO>> GetAllEmployeesAsync();
        Task<Employee> AddEmployeeAsync(Employee emp);
        Task<Employee> UpdateEmployeeAsync(Employee emp);
        Task DeleteEmployeeAsync(int empId);
        Task DeleteListOfEmployeesAsync(List<int> EmployeeIds);

    }
}
