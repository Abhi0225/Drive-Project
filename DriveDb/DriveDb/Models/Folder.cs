using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace DriveDb.Models
{
    public class Folder
    {
        [BsonId]
        [BsonElement("_id"), BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string FolderName { get; set; }

        public string username { get; set; }
    }
}
