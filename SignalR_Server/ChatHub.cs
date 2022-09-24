using Microsoft.AspNetCore.SignalR;
using System.Xml.Linq;
using RabbitMQ.Client.Events;
using SignalR_Server.Services;
using System.Text;
using System.Text.Unicode;
using Newtonsoft.Json;
using SignalR_Server.DTO;

namespace SignalR_Server {
    public class ChatHub : Hub{
        private static readonly ConnectionsManager _connections =  new ConnectionsManager();
        private readonly IRabbitmqService _rabbitmqService;
        private readonly IEnvService _envService;


        public ChatHub(IRabbitmqService rabbitmqService, IEnvService envService) {
            _rabbitmqService = rabbitmqService;
            _envService = envService;
        }


        public async Task Introduce(string username) {
            _connections.Add(Context.ConnectionId, new User(){Name = username});
            await Clients.All.SendAsync("userJoined", username, DateTime.UtcNow, _envService.ServerName);
        }

        public async Task Send(string message) {
            var user = _connections.GetUser(Context.ConnectionId);

            await Clients.All.SendAsync("messageReceived", user.Name, message, DateTime.UtcNow, _envService.ServerName);

            var data = JsonConvert.SerializeObject(new Message() {
                Username = user.Name,
                Data = message,
                Time = DateTime.UtcNow,
                ServerName = _envService.ServerName
            });
            _rabbitmqService.Publish("", Encoding.UTF8.GetBytes(data), RabbitExchanges.Messages);
        }
    }

    class User {
        public string Name { get; set; }
    }

    class ConnectionsManager {
        Dictionary<string, User> _users = new Dictionary<string, User>();

        public void Add(string connectionId, User user) {
            _users.TryAdd(connectionId, user);
        }

        public User GetUser(string connectionId) {
            User res = null;
            _users.TryGetValue(connectionId, out res);
            return res;
        }
    }
}
