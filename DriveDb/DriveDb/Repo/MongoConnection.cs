using MongoDB.Driver;
using MongoDB.Bson;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver.Core.Configuration;
using DriveDb.Models;
namespace DriveDb.Repo
{
    public class MongoConnection
    {
        private readonly IMongoDatabase _database;
        private readonly IConfiguration _configuration;
        public MongoConnection(IConfiguration configuration)
        {
            _configuration = configuration;
            var connectionstring = _configuration.GetConnectionString("DbConnection");
            var mongoUrl = MongoUrl.Create(connectionstring);
            var mongoclient = new MongoClient(mongoUrl);
            _database = mongoclient.GetDatabase(mongoUrl.DatabaseName);
        }
        public IMongoDatabase Database => _database;
        public IMongoCollection<User> user => Database.GetCollection<User>("userdata");
        public IMongoCollection<Files> file => Database.GetCollection<Files>("files");
        public IMongoCollection<Share> sfiles => Database.GetCollection<Share>("Sharedfiles");
        public IMongoCollection<Trash> trash => Database.GetCollection<Trash>("Trash");


        public IMongoCollection<Folder> floder => Database.GetCollection<Folder>("Floder");
    }
}