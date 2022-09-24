using System.Text;
using Microsoft.AspNetCore.SignalR;
using RabbitMQ.Client.Events;
using SignalR_Server;
using SignalR_Server.Configs;
using SignalR_Server.Services;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.AddCors(options => {
    options.AddPolicy("CorsPolicy", builder => {
        builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});
builder.Services.AddSingleton<IEnvService, EnvService>();
builder.Services.AddSignalR((options) => { });
builder.Services.AddSingleton<IRabbitmqService, RabbitmqService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if(!app.Environment.IsDevelopment()) {
    app.UseExceptionHandler("/Home/Error");
}
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.UseCors("CorsPolicy");
app.MapHub<ChatHub>("/chat");

ActivatorUtilities.CreateInstance<RabbitmqConfig>(app.Services).RegisterConsumers();

app.Run();

