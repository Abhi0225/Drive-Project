using DriveDb.Service;
using Microsoft.AspNetCore.Mvc;
using DriveDb.Models;
using System.IO;
using MongoDB.Driver;
using DriveDb.Repo;
using System.Runtime.CompilerServices;
using MongoDB.Bson;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;

namespace DriveDb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly EmailService _emailService;
        private readonly IMongoCollection<Files> _filesCollection;
        private readonly MongoConnection _mongoConnection;

        public EmailController(EmailService emailService, MongoConnection mongoConnection)
        {
            _emailService = emailService;
            _mongoConnection = mongoConnection;
            _filesCollection = _mongoConnection.file;
    
        }

        [HttpPost("send")]
        public IActionResult SendEmail([FromBody] Email email)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _emailService.SendEmailAsync(email);
            return Ok(new { message = "Email sent successfully" });
        }
        [HttpGet]
        [Route("api/filedownload")]
        public async Task<IActionResult> DownloadFile(string username,string filename)
        {
            var filter = Builders<Files>.Filter.AnyEq(f => f.UserName, username);
            var files = await _filesCollection.Find(filter).ToListAsync();
            if (files.Count == 0)
            {
                var Response = new { message = "no file is found" };
                return NotFound(Response);
            }
            else
            {
                return Ok(files);

            }
            return BadRequest();
        }

        //[HttpPost("upload")]
        //public async Task<IActionResult> UploadFile(IFormFile file, string username)
        //{

        //    if (file == null || file.Length == 0)
        //        return BadRequest("File is not selected");

        //    using (var memoryStream = new MemoryStream())
        //    {
        //        await file.CopyToAsync(memoryStream);
        //        var fileData = memoryStream.ToArray();

        //        var fileModel = new Files
        //        {
        //            FileName = file.FileName,
        //            ContentType = file.ContentType,
        //            FileData = fileData,
        //            UserName = username
        //        };

        //        await _filesCollection.InsertOneAsync(fileModel);

        //        return Ok(new { fileId = fileModel.Id });
        //    }
        //}
        //    [HttpGet("files/{username}")]
        //    public async Task<IActionResult> GetFilesByUsername(string username)
        //    {
        //    var filter = Builders<Files>.Filter.Eq(f => f.UserName, username);
        //    var files = await _filesCollection.Find(filter).ToListAsync();
        //    if (files.Count == 0)
        //    {
        //        var Response = new { message = "no file is found" };
        //        return BadRequest(Response);
        //    }
        //    else
        //    {
        //        return Ok(files);

        //    }

        //    }
        //[HttpGet("files")]
        //public async Task<IActionResult> GetFile()
        //{
        //    var files = await _filesCollection.Find(_ => true).ToListAsync();
        //    var fileModels = files.Select(file => new Files
        //    {
        //        Id = file.Id.ToString(),
        //        FileName = file.FileName,
        //        ContentType = file.ContentType,
        //        FileData = file.FileData // Ensure this is a byte array
        //    }).ToList();
        //    return Ok(fileModels);
        //}
        //[HttpPost]
        //public async Task<IActionResult> UploadFiles([FromForm] IFormFileCollection files)
        //{
        //    if (files == null || files.Count == 0)
        //    {
        //        return BadRequest(new { message = "No files were provided." });
        //    }

        //    var fileDocuments = new List<Files>();

        //    foreach (var file in files)
        //    {
        //        if (file != null)
        //        {
        //            using (var stream = new MemoryStream())
        //            {
        //                await file.CopyToAsync(stream);
        //                var fileDocument = new Files
        //                {
        //                    FileName = file.FileName,
        //                    ContentType = file.ContentType,
        //                    FileData = stream.ToArray()
        //                };
        //                fileDocuments.Add(fileDocument);
        //            }
        //        }
        //    }

        //    if (fileDocuments.Count > 0)
        //    {
        //        await _filesCollection.InsertManyAsync(fileDocuments);
        //        return Ok(new { message = "Files uploaded successfully" });
        //    }
        //    else
        //    {
        //        return BadRequest(new { message = "No valid files were found to upload." });
        //    }
        //}

        //[HttpGet("search")]
        //public IActionResult SearchFiles(string username, string query)
        //{
        //    if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(query))
        //    {
        //        return BadRequest("Username and query must be provided.");
        //    }

        //    var filter = Builders<Files>.Filter.And(
        //        Builders<Files>.Filter.Eq(f => f.UserName, username),
        //        Builders<Files>.Filter.Regex(f => f.FileName, new MongoDB.Bson.BsonRegularExpression(query, "i"))
        //    );

        //    var results = _filesCollection.Find(filter).ToList();

        //    return Ok(results.Select(f => f.FileName));
        //}
    }
}

  

