using DriveDb.Models;
using DriveDb.Repo;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Diagnostics.Eventing.Reader;
using System.Threading.Tasks;

namespace DriveDb.Service
{
    public class UserService : IUser
    {
        private readonly MongoConnection _mongoConnection;
        private readonly IMongoCollection<User> _users;
        public UserService(MongoConnection mongoConnection)
        {
            _mongoConnection = mongoConnection;
            _users = mongoConnection.user;
        }
        public async Task<bool> AddData(User data)
        {
            var database = _mongoConnection.Database;
            var collection = database.GetCollection<User>("userdata");
            try
            {
                await collection.InsertOneAsync(data);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
                return false;
            }
        }

        public async Task<User>  GetUserauth(Userauth model)
        {
            var database = _mongoConnection.Database;
            var collection = database.GetCollection<User>("userdata");

            try
            {
                var filter = Builders<User>.Filter.And(
             Builders<User>.Filter.Eq(x => x.Username, model.Username),
             Builders<User>.Filter.Eq(x => x.Password, model.Password)
              );
                var projection = Builders<User>.Projection.Expression(u => new User
                {
                    Username = u.Username,
                    Email= u.Email,
                    
                });

                var user = await collection.Find(filter).Project(projection).FirstOrDefaultAsync();
                return user;
            }

            catch (Exception ex)
            {
                return null;
            }
        }
}

    }
        

    

