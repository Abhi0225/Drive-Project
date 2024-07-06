using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace DriveDb.Models
{
    public class Files
    {
        [BsonId]
        [BsonElement("_id"), BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string FolderId { get; set; }
        public string? FileName { get; set; }
        public List<string>? UserName { get; set; }
        public string? ContentType { get; set; }
        public byte[] FileData { get; set; }
    }
}
