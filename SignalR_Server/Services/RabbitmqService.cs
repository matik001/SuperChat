using System.Text;
using System.Threading.Channels;
using RabbitMQ.Client;

namespace SignalR_Server.Services {
    public class RabbitmqService : IRabbitmqService {
        private ConnectionFactory _factory = null;

        public ConnectionFactory Factory {
            get {
                if (_factory == null) {

                    _factory = new ConnectionFactory() {
                        HostName = _envService.RabbitmqHost,
                        UserName = _envService.RabbitmqUser,
                        Password = _envService.RabbitmqPass
                    };
                    _factory.AutomaticRecoveryEnabled = true;
                }

                
                return _factory;
            }
        }

        private IConnection _connection = null;
        private IModel _channel = null;

        public IConnection Connection {
            get => _connection;
        }
        public IModel Channel {
            get => _channel;
        }

        private string _messagesQueueName = null;

        private readonly IEnvService _envService;


        public RabbitmqService(IEnvService envService) {
            _envService = envService;
            while (true) {
                try {
                    _connection = Factory.CreateConnection();
                    break;
                }
                catch (Exception e) {
                    Console.Error.WriteLine(e);
                    Console.Error.WriteLine("Trying to connect to rabbitmq");
                    Task.Delay(1000).Wait();
                }
            }
            _channel = _connection.CreateModel();
            initQueues();
        }

        string toQueueName(RabbitQueues queue) {
            switch (queue) {
                case RabbitQueues.Messages:
                    return _messagesQueueName;
                default:
                    return queue.ToStringValue();
            }
        }

        public void Publish(string route, byte[] data, RabbitExchanges exchange = RabbitExchanges.Default) {
            Channel.BasicPublish(
                exchange: exchange.ToStringValue(),
                routingKey: route,
                basicProperties: null,
                body: data);
        }



        public void RegisterConsumer(RabbitQueues queue, IBasicConsumer consumer) {
            Channel.BasicConsume(
                queue: toQueueName(queue),
                autoAck: false,
                consumer: consumer);
        }

        public void Ack(ulong deliveryTag) {
            Channel.BasicAck(deliveryTag: deliveryTag, multiple: false);
        }


        private void initQueues() {
            // _channel.QueueDeclare(queue: RabbitQueues.Commands.ToStringValue(),
            //     durable: true,
            //     exclusive: false,
            //     autoDelete: false,
            //     arguments: null);

            Channel.ExchangeDeclare(RabbitExchanges.Messages.ToStringValue(), ExchangeType.Fanout);

            _messagesQueueName = Channel.QueueDeclare().QueueName;
            Channel.QueueBind(queue: _messagesQueueName,
                exchange: RabbitExchanges.Messages.ToStringValue(),
                routingKey: "");
            
        }

        public void Dispose() {
            _channel?.Dispose();
            _connection?.Dispose();
        }

    }
}
