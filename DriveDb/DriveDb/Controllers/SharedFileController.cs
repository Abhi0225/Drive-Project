using DriveDb.Models;
using DriveDb.Repo;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace DriveDb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SharedFileController : ControllerBase
    {
        private readonly IMongoCollection<Share> _sharedfilesCollection;
        private readonly MongoConnection _mongoConnection;
        public SharedFileController(MongoConnection mongoConnection)
        {
            _sharedfilesCollection = mongoConnection.sfiles;
            _mongoConnection = mongoConnection;
        }

        [HttpPost]
        public async Task<IActionResult> ShareFile([FromBody] Share share)
        {
            if (share == null || string.IsNullOrEmpty(share.SenderUsername) || share.ReceiverUsernames == null || !share.ReceiverUsernames.Any() || share.FileName == null)
            {
                return BadRequest("Invalid share data.");
            }

            await _sharedfilesCollection.InsertOneAsync(share);

            return Ok(share);
        }
    }
}
