using RabbitMQ.Client;
using System.ComponentModel;

namespace SignalR_Server.Services {
    public enum RabbitQueues {
        [Description("messages")]
        Messages,
        [Description("commands")]
        Commands
    }
    public enum RabbitExchanges {
        [Description("")]
        Default,
        [Description("messages")]
        Messages
    }


    public interface IRabbitmqService : IDisposable {

        IConnection Connection { get; }
        IModel Channel { get; }

        void Publish(string route, byte[] data, RabbitExchanges exchange = RabbitExchanges.Default);

        void RegisterConsumer(RabbitQueues queue, IBasicConsumer consumer);

        void Ack(ulong deliveryTag);

    }
}
