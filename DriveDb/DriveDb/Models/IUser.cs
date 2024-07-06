namespace DriveDb.Models
{
    public interface IUser
    {
        public Task<bool> AddData(User data);
        public  Task<User> GetUserauth(Userauth model);
    }
}
