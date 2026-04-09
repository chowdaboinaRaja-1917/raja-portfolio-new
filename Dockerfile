# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

COPY . .

WORKDIR /app/Raja_Portfolio.Server
RUN dotnet restore
RUN dotnet publish -c Release -o out

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/Raja_Portfolio.Server/out .

EXPOSE 8080
ENTRYPOINT ["dotnet", "Raja_Portfolio.Server.dll"]
