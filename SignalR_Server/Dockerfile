#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
# install npm
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

WORKDIR /src
COPY SignalR_Server.csproj SignalR_Server/
RUN dotnet restore "SignalR_Server/SignalR_Server.csproj"
COPY ./package.json ./SignalR_Server
WORKDIR /src/SignalR_Server
RUN npm i
COPY . .
RUN npm run build
RUN dotnet build "SignalR_Server.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SignalR_Server.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SignalR_Server.dll"]