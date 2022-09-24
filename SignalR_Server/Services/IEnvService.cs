namespace SignalR_Server.Services {
    public interface IEnvService {
        public string ServerName { get; set; }
        public string RabbitmqHost { get; set; }
        public string RabbitmqUser { get; set; }
        public string RabbitmqPass { get; set; }
    }
}
