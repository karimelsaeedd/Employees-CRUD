using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly EmployeeContext _context;

        public EmployeeRepository(EmployeeContext context)
        {
            _context = context;
        }

        public async Task<Employee> AddEmployeeAsync(Employee emp)
        {
            await _context.Employees.AddAsync(emp);
            await _context.SaveChangesAsync();

            return (emp);
        }

        public async Task DeleteEmployeeAsync(int empId)
        {
            var employee = await _context.Employees.FindAsync(empId);
            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteListOfEmployeesAsync(List<int> EmployeeIds)
        {
            var employeesToDelete = _context.Employees.Where(e => EmployeeIds.Contains(e.Id)).ToList();

            _context.Employees.RemoveRange(employeesToDelete);
            await _context.SaveChangesAsync();
        }

        public async Task<IReadOnlyList<EmployeeToReturnDTO>> GetAllEmployeesAsync()
        {
            var employee = await _context.Employees.ToListAsync();

            var EmployeeToReturn = employee
                .Select(employee => new EmployeeToReturnDTO
                {
                    Id = employee.Id,
                    Name = employee.Name,
                    Email = employee.Email,
                    Mobile = employee.Mobile,
                    Address = employee.Address
                })
                .ToList();

            return EmployeeToReturn;
        }

        public async Task<Employee> UpdateEmployeeAsync(Employee emp)
        {
            _context.Entry(emp).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return emp;
        }
    }
}
