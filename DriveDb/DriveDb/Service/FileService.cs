using DriveDb.Models;
using DriveDb.Repo;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using Org.BouncyCastle.Tls;

namespace DriveDb.Service
{
    public class FileService
    {
        private readonly IMongoCollection<Files> _filesCollection;
        private readonly IMongoCollection<Share> _shareCollection;
        private readonly IMongoCollection<Trash> _trashCollection;
        private readonly MongoConnection _mongoConnection;
        public FileService(MongoConnection mongoConnection)
        {
            _mongoConnection = mongoConnection;
            _filesCollection = mongoConnection.file;
            _shareCollection = mongoConnection.sfiles;
            _trashCollection = mongoConnection.trash;
        }


        public async Task<List<Files>> GetSharedFilesAsync(string receiverUsername)
        {
            // Find shared files where receiverUsername is in ReceiverUsernames
            var sharedFiles = await _shareCollection
                .Find(s => s.ReceiverUsernames.Contains(receiverUsername))
                .Project(s => new { s.SenderUsername, s.FileName })
                .ToListAsync();

            var fileNames = sharedFiles.Select(s => s.FileName).ToList();
            var senderUsernames = sharedFiles.Select(s => s.SenderUsername).ToList();

            // Find files in Files collection where FileName is in fileNames and UserName matches senderUsernames
            var filter = Builders<Files>.Filter.In(f => f.FileName, fileNames)
                         & Builders<Files>.Filter.AnyIn(f => f.UserName, senderUsernames);

            return await _filesCollection.Find(filter).ToListAsync();
        }

        public async Task<List<Files>> GetFilesAndSharedFiles(string username)
        {
            // First API logic to get files by username
            var filter = Builders<Files>.Filter.AnyEq(f => f.UserName, username);
            var files = await _filesCollection.Find(filter).ToListAsync();

            // Second API logic to get shared files where receiverUsername matches
            var sharedFiles = await _shareCollection
                .Find(s => s.ReceiverUsernames.Contains(username))
                .Project(s => new { s.SenderUsername, s.FileName })
                .ToListAsync();

            var fileNames = sharedFiles.Select(s => s.FileName).ToList();
            var senderUsernames = sharedFiles.Select(s => s.SenderUsername).ToList();
            var filters = Builders<Files>.Filter.In(f => f.FileName, fileNames)
                         & Builders<Files>.Filter.AnyIn(f => f.UserName, senderUsernames);
            var files1 = await _filesCollection.Find(filters).ToListAsync();
            var combinedResult = files.Concat(files1).ToList();

            return combinedResult;

        }

        private async Task<List<Files>> GetSharedFiles(List<string> fileNames, List<string> senderUsernames)
        {
            var filter = Builders<Files>.Filter.In(f => f.FileName, fileNames)
                         & Builders<Files>.Filter.AnyIn(f => f.UserName, senderUsernames);

            return await _filesCollection.Find(filter).ToListAsync();
        }

        public async Task<List<Trash>> Restorefilesformtrash(string username,string filename)
        {
            var filter = Builders<Trash>.Filter.Eq("FileName", filename)
                        & Builders<Trash>.Filter.Eq("UserName", username);
            var fileToMove = await _trashCollection.Find(filter).FirstOrDefaultAsync();

            if (fileToMove != null)
            {
                var file = new Files
                {
                    Id = fileToMove.Id,
                    FileName = fileToMove.FileName,
                    UserName = new List<string> { username },
                    ContentType = fileToMove.ContentType,
                    FileData = fileToMove.FileData
                };
                _filesCollection.InsertOne(file);
                _trashCollection.DeleteOne(filter);
            }

           return await _trashCollection.Find(filter).ToListAsync();
        } 
    }
}
