using DriveDb.Models;
using DriveDb.Repo;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Collections;

namespace DriveDb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController: ControllerBase
    {
        private readonly IUser _iuser;
        private readonly MongoConnection _mongoConnection;
        public UserController(IUser user, MongoConnection connection)
        {
            _iuser = user;
            _mongoConnection = connection;
        }

        [HttpPost("user")]
        public async Task<IActionResult> authendication([FromBody] Userauth model)
        {
            try
            {
                var username = await _iuser.GetUserauth(model);
                if (username != null)
                {
                    return Ok(username);
                }
                else
                {
                    var response = new { message = "user not found" };
                    return BadRequest(response);
                }
            }
            catch (Exception ex)
            {
                var response = new { message = "user not found"};
                return BadRequest(ex.Message);
            }

        }
        [HttpPost]
        public async Task<IActionResult> Adding_User_data([FromBody] User model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (await _iuser.AddData(model))
            {
                var response = new { message = "Data inserted successfully" };
                return Ok(response);
            }

            return StatusCode(500, new { message = "An error occurred while adding the user." });
        }


    }
}
