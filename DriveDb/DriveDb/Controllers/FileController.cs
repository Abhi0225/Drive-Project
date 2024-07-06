using DriveDb.Models;
using DriveDb.Repo;
using DriveDb.Service;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using Org.BouncyCastle.Asn1.X509;

namespace DriveDb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class FileController : ControllerBase
    {
        private readonly IMongoCollection<Files> _filesCollection;
        private readonly MongoConnection _mongoConnection;
        private readonly FileService _fileService;
        private readonly IMongoCollection<Trash> _trashCollection;
        private readonly IMongoCollection<Folder> _folderCollection;
        public FileController(MongoConnection mongoConnection, FileService file)
        {
            _filesCollection = mongoConnection.file;
            _mongoConnection = mongoConnection;
            _fileService = file;
            _trashCollection = mongoConnection.trash;
            _folderCollection = mongoConnection.floder;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile(IFormFile file, string username)
        {
            if (file == null || file.Length == 0)
                return BadRequest("File is not selected");

            using (var memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);
                var fileData = memoryStream.ToArray();

                var fileModel = new Files
                {
                    FileName = file.FileName,
                    ContentType = file.ContentType,
                    FileData = fileData,
                    UserName = new List<string> { username }
                };

                try
                {
                    await _filesCollection.InsertOneAsync(fileModel);
                    return Ok(new { message = $"{file.FileName} is successfully inserted" });
                }
                catch (Exception ex)
                {


                    return StatusCode(500, new { message = $"{file.FileName} is not uploaded" });
                }
            }
        }
        // get files by user
        [HttpGet("files/username")]
        public async Task<IActionResult> GetFilesByUsername(string username)
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

        // get all files in the db 
        [HttpGet("files")]
        public async Task<IActionResult> GetFile()
        {
            var files = await _filesCollection.Find(_ => true).ToListAsync();
            var fileModels = files.Select(file => new Files
            {
                Id = file.Id.ToString(),
                FileName = file.FileName,
                ContentType = file.ContentType,
                FileData = file.FileData // Ensure this is a byte array
            }).ToList();
            return Ok(fileModels);
        }

        // upload folder 

        [HttpPost("uploadfolder")]
        public async Task<IActionResult> UploadFiles(string username, string foldername, [FromForm] IFormFileCollection files)
        {
            if (string.IsNullOrEmpty(foldername))
            {
                return BadRequest(new { message = "Username is required." });
            }

            if (files == null || files.Count == 0)
            {
                return BadRequest(new { message = "No files were provided." });
            }

            var fileDocuments = new List<Files>();
            Folder folder = null;

            foreach (var file in files)
            {
                if (file != null)
                {
                    // Extract the folder name from the file path
                    var filePath = file.FileName;
                    var folderName = foldername;

                    // Ensure the folder is created only once
                    if (folder == null || folder.FolderName != folderName)
                    {
                        folder = await _folderCollection.Find(f => f.FolderName == folderName).FirstOrDefaultAsync();
                        if (folder == null)
                        {
                            folder = new Folder
                            {
                                Id = ObjectId.GenerateNewId().ToString(),
                                FolderName = folderName,
                                username=username
                            };
                            await _folderCollection.InsertOneAsync(folder);
                        }
                    }

                    using (var stream = new MemoryStream())
                    {
                        await file.CopyToAsync(stream);
                        var fileDocument = new Files
                        {
                            Id = ObjectId.GenerateNewId().ToString(),
                            FolderId = folder.Id,
                            UserName = new List<string> { username },
                            FileName = Path.GetFileName(file.FileName), // Store only the file name, not the path
                            ContentType = file.ContentType,
                            FileData = stream.ToArray()
                        };
                        fileDocuments.Add(fileDocument);
                    }
                }
            }

            if (fileDocuments.Count > 0)
            {
                await _filesCollection.InsertManyAsync(fileDocuments);
                return Ok(new { message = "Files uploaded successfully", folderId = folder.Id });
            }
            else
            {
                return BadRequest(new { message = "No valid files were found to upload." });
            }
        }

        private string GetFolderNameFromFilePath(string filePath)
        {
            if (string.IsNullOrEmpty(filePath))
            {
                return string.Empty;
            }

            var folderName = filePath.Split('/').FirstOrDefault();
            return folderName ?? string.Empty;
        }


        [HttpGet("filesbyfoldernames")]
        public async Task<IActionResult> GetFilesByFolderName(string username, string folderName)
        {
            if (string.IsNullOrEmpty(folderName))
            {
                return BadRequest(new { message = "Folder name is required." });
            }

            var folder = await _folderCollection.Find(f => f.FolderName == folderName && f.username == username).FirstOrDefaultAsync();
            if (folder == null)
            {
                return NotFound(new { message = "Folder not found for the specified user." });
            }

            var files = await _filesCollection.Find(f => f.FolderId == folder.Id).ToListAsync();

            if (files == null || files.Count == 0)
            {
                return NotFound(new { message = "No files found in the folder." });
            }

            return Ok(files);
        }

        [HttpGet("foldernames")]

        public async Task<IActionResult> getfoldernames(string username)
        {
            try
            {
                var folders = await _folderCollection.Find(f => f.username == username).ToListAsync();
                var folderNames = folders.Select(f => f.FolderName).ToList();

                if (folderNames.Count == 0)
                {
                    return NotFound(new { message = "No folders found for the specified user." });
                }

                return Ok(folderNames);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // search filoe based on username and file starting letter
        [HttpGet("search")]
        public IActionResult SearchFiles(string username, string query)
        {
            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(query))
            {
                return BadRequest("Username and query must be provided.");
            }

            var filter = Builders<Files>.Filter.And(
                Builders<Files>.Filter.AnyEq(f => f.UserName, username),
                Builders<Files>.Filter.Regex(f => f.FileName, new MongoDB.Bson.BsonRegularExpression(query, "i"))
            );

            var results = _filesCollection.Find(filter).ToList();

            return Ok(results.Select(f => f.FileName));
        }


        [HttpGet("shared")]
        public async Task<ActionResult<List<Files>>> GetSharedFiles(string receiverUsername)
        {
            var files = await _fileService.GetSharedFilesAsync(receiverUsername);
            if (files == null || files.Count == 0)
            {
                var Response = new { message = "no file is found" };
                return NotFound(Response);
            }

            return Ok(files);
        }

        [HttpGet("share")]
        public async Task<ActionResult<List<Files>>> allfiles(string receiverUsername)
        {
            var combinedResult = await _fileService.GetFilesAndSharedFiles(receiverUsername);

            if (combinedResult.Count == 0)
            {
                var Response = new { message = "no file is found" };
                return NotFound(Response);
            }
            else
            {
                return Ok(combinedResult);
            }
            return BadRequest();
        }
        [HttpPost("trash")]
        public async Task<IActionResult> MoveFile(string filename, string username)
        {
            // Validate inputs
            if (string.IsNullOrEmpty(filename) || string.IsNullOrEmpty(username))
            {
                return BadRequest("Filename and username are required.");
            }

            
            var filter = Builders<Files>.Filter.Eq(f => f.FileName, filename) & Builders<Files>.Filter.AnyEq(f => f.UserName, username);
            var fileToMove = await _filesCollection.Find(filter).FirstOrDefaultAsync();

            if (fileToMove == null)
            {
                return NotFound();
            }

            var trashFile = new Trash
            {
                Id = fileToMove.Id, // Assuming the same ObjectId can be used
                FileName = fileToMove.FileName,
                UserName = fileToMove.UserName,
                FileData = fileToMove.FileData,
            };

            await _trashCollection.InsertOneAsync(trashFile);
            _filesCollection.DeleteOne(filter);


            return Ok();
        }


        [HttpGet("trashfiles")]
        public async Task<IActionResult> Gettrashfiles(string username)
        {
            var filter = Builders<Trash>.Filter.AnyEq(f => f.UserName, username);
            var files = await _trashCollection.Find(filter).ToListAsync();

            if (files.Count == 0)
            {
                var Response = new { message = "no file is found" };
                return BadRequest(Response);
            }
            else
            {
                return Ok(files);

            }

        }

        [HttpGet("restoretrashfiles")]
        public async Task<IActionResult> restoretrashfiles(string username,string filename)
        {
            try
            {
                var files = await _fileService.Restorefilesformtrash(username,filename);
                if (files.Count == 0)
                {
                    return Ok(new { message = "file moved successfully" });
                    
                }
                else
                {
                    return NotFound(new { message = "not possibe to move files" });
                }

            }
            catch (Exception ex)
            {

                return BadRequest(ex.Message);

            }
            return BadRequest();

        }

        [HttpDelete("filedelete")]
        public async Task<IActionResult> Deletefile(string username, string filename)
        {
            

            try
            {
                var filter = Builders<Trash>.Filter.Eq("FileName", filename)
                         & Builders<Trash>.Filter.Eq("UserName", username);
                var files = await _trashCollection.Find(filter).ToListAsync();
                if (files.Count == 0)
                {
                    return NotFound();
                }
                else
                {
                    _trashCollection.DeleteOne(filter);
                    return Ok(new { message = "deleted file successfully" });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            return BadRequest();
        }

    }


}
