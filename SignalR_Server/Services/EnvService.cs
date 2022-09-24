namespace SignalR_Server.Services {
    public class EnvService : IEnvService{

        public EnvService() {
            ServerName = Environment.GetEnvironmentVariable("SERVER_NAME");
            RabbitmqHost = Environment.GetEnvironmentVariable("RABBITMQ_HOST");
            RabbitmqUser = Environment.GetEnvironmentVariable("RABBITMQ_USER");
            RabbitmqPass = Environment.GetEnvironmentVariable("RABBITMQ_PASS");
        }
        public string ServerName { get; set; }
        public string RabbitmqHost { get; set; }
        public string RabbitmqUser { get; set; }
        public string RabbitmqPass { get; set; }
    }
}
