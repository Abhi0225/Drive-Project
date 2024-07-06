using MimeKit;
//using MailKit.Net.Smtp;
using System.Threading.Tasks;
using DriveDb.Models;
using System.Net.Mail;
using System.Net;
using MongoDB.Driver;
using DriveDb.Repo;
using Microsoft.AspNetCore.Mvc.Diagnostics;
using Microsoft.AspNetCore.Mvc;
namespace DriveDb.Service
{
    public class EmailService
    {
        private readonly IMongoCollection<Files> _filesCollection;
        private readonly string _smtpServer = "smtp.gmail.com";
        private readonly int _smtpPort = 587;
        private readonly string _smtpUser = "20ne1a05g8@gmail.com";
        private readonly string _smtpPass = "yfltdwnsczkbkpjc";
        private readonly MongoConnection _mongoConnection;
        public EmailService(MongoConnection mongoConnection)
        {
            _mongoConnection = mongoConnection;
            _filesCollection = mongoConnection.file;
        }
        public void SendEmailAsync(Email email)
        {

            try
            {
                MailMessage message2 = new MailMessage();
                message2.From = new MailAddress("20ne1a05g8@gmail.com");
                message2.To.Add(email.To);
                message2.Subject = email.Subject;
                message2.Body = "requesting the file";
                message2.IsBodyHtml = true;
                using (SmtpClient client = new SmtpClient("smtp.gmail.com", 587)) // 587 is the common port for SMTP with TLS
                {
                    client.Credentials = new NetworkCredential(_smtpUser, _smtpPass);
                    client.EnableSsl = true;
                    client.Send(message2);
                }
            }
            catch (SmtpException ex)
            {
                Console.WriteLine($"SMTP Exception: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"General Exception: {ex.Message}");
            }
        }


        public string DownloadFile(string username, string filename)
        {
            var filter = Builders<Files>.Filter.Eq("FileName", filename) &
                         Builders<Files>.Filter.Eq("UserName", username);
            var fileToMoveTask = _filesCollection.Find(filter).FirstOrDefaultAsync();

            var fileToMove = fileToMoveTask.Result; // Await the task to get the result synchronously

            if (fileToMove != null)
            {
                var file = new Files
                {
                    FileName = fileToMove.FileName,
                    UserName = new List<string> { username },
                    ContentType = fileToMove.ContentType,
                    FileData = fileToMove.FileData
                };
                string  filedata = Convert.ToBase64String(fileToMove.FileData);
               // byte[] fileData=  Convert.FromBase64String(filedata);
                return filedata;
            }
            return null;
        }

    }

}

