using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
            try
            {
                // Check for duplicate email
                var existingEmployeeWithEmail = await _context.Employees.FirstOrDefaultAsync(e => e.Email == emp.Email);
                if (existingEmployeeWithEmail != null)
                {
                    throw new Exception("An employee with the same email already exists.");
                }

                // Check for duplicate phone number
                var existingEmployeeWithPhone = await _context.Employees.FirstOrDefaultAsync(e => e.Mobile == emp.Mobile);
                if (existingEmployeeWithPhone != null)
                {
                    throw new Exception("An employee with the same phone number already exists.");
                }

                await _context.Employees.AddAsync(emp);
                await _context.SaveChangesAsync();
                return emp;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while adding an employee.", ex);
            }
        }

        public async Task DeleteEmployeeAsync(int empId)
        {
            try
            {
                var employee = await _context.Employees.FindAsync(empId);
                if (employee != null)
                {
                    _context.Employees.Remove(employee);
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting an employee.", ex);
            }
        }

        public async Task DeleteListOfEmployeesAsync(List<int> EmployeeIds)
        {
            try
            {
                var employeesToDelete = await _context.Employees
                    .Where(e => EmployeeIds.Contains(e.Id))
                    .ToListAsync();

                if (employeesToDelete.Any())
                {
                    _context.Employees.RemoveRange(employeesToDelete);
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting a list of employees.", ex);
            }
        }

        public async Task<IReadOnlyList<EmployeeToReturnDTO>> GetAllEmployeesAsync()
        {
            try
            {
                var employees = await _context.Employees.ToListAsync();

                var employeeToReturn = employees
                    .Select(employee => new EmployeeToReturnDTO
                    {
                        Id = employee.Id,
                        Name = employee.Name,
                        Email = employee.Email,
                        Mobile = employee.Mobile,
                        Address = employee.Address
                    })
                    .ToList();

                return employeeToReturn;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving all employees.", ex);
            }
        }

        public async Task<Employee> UpdateEmployeeAsync(Employee emp)
        {
            try
            {
                // Check for duplicate email
                var existingEmployeeWithEmail = await _context.Employees.FirstOrDefaultAsync(e => e.Email == emp.Email && e.Id != emp.Id);
                if (existingEmployeeWithEmail != null)
                {
                    throw new Exception("An employee with the same email already exists.");
                }

                // Check for duplicate phone number
                var existingEmployeeWithPhone = await _context.Employees.FirstOrDefaultAsync(e => e.Mobile == emp.Mobile && e.Id != emp.Id);
                if (existingEmployeeWithPhone != null)
                {
                    throw new Exception("An employee with the same phone number already exists.");
                }

                _context.Entry(emp).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return emp;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while updating an employee.", ex);
            }
        }
    }
}
