using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeRepository _repo;

        public EmployeeController(IEmployeeRepository repo)
        {
            _repo = repo;
        }
        [HttpGet]
        public async Task<IActionResult> GetALLEmployees()
        {
            var employees = await _repo.GetAllEmployeesAsync();
            return Ok(employees);
        }

        [HttpPost]
        public async Task<IActionResult> AddEmployee(Employee emp)
        {
            var employee = await _repo.AddEmployeeAsync(emp);
            return Ok(emp);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateEmployee(Employee emp)
        {
            var employee = await _repo.UpdateEmployeeAsync(emp);
            return Ok(emp);
        }

        [HttpDelete("DeleteEmployee")]
        public async Task<IActionResult> DeleteEmployee(int empId)
        {
            await _repo.DeleteEmployeeAsync(empId);
            return Ok();
        }

        [HttpDelete("DeleteListOfEmployee")]
        public async Task<IActionResult> DeleteListOfEmployees([FromBody]List<int> empIds)
        {
            await _repo.DeleteListOfEmployeesAsync(empIds);
            return Ok();
        }
    }
}
