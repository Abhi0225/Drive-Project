using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace DriveDb.Models
{
    public class Share
    {

        [BsonId]
        public ObjectId Id { get; set; }
        public string? SenderUsername { get; set; }
        public List<string> ReceiverUsernames { get; set; }
        public String? FileName { get; set; }
    }
}
