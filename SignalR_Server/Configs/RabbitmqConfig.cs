using System.Text;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using RabbitMQ.Client.Events;
using SignalR_Server.DTO;
using SignalR_Server.Services;

namespace SignalR_Server.Configs {
    public class RabbitmqConfig {
        private readonly IHubContext<ChatHub> _chatHub;
        private readonly IRabbitmqService _rabbitmqService;
        private readonly IEnvService _envService;

        public RabbitmqConfig(IHubContext<ChatHub> chatHub, IRabbitmqService rabbitmqService, IEnvService envService) {
            _chatHub = chatHub;
            _rabbitmqService = rabbitmqService;
            _envService = envService;
        }

        public void RegisterConsumers() {
            var consumer = new EventingBasicConsumer(_rabbitmqService.Channel);
            consumer.Received += async (s, e) => {
                var data = Encoding.UTF8.GetString(e.Body.ToArray());
                var msg = JsonConvert.DeserializeObject<Message>(data);
                if(msg.ServerName != _envService.ServerName)
                    await _chatHub.Clients.All.SendAsync("messageReceived", msg.Username, msg.Data, msg.Time, msg.ServerName);

                _rabbitmqService.Ack(e.DeliveryTag);
            };
            _rabbitmqService.RegisterConsumer(RabbitQueues.Messages, consumer);
        }
    }

}
