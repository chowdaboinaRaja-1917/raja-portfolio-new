# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# ✅ Install Node.js
RUN apt-get update && apt-get install -y nodejs npm

WORKDIR /app
COPY . .

# Build Angular
WORKDIR /app/raja_portfolio.client
RUN npm install
RUN npm run build -- --configuration production

# Build .NET
WORKDIR /app/Raja_Portfolio.Server
RUN dotnet restore
RUN dotnet publish -c Release -o out

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/Raja_Portfolio.Server/out .

EXPOSE 8080
ENTRYPOINT ["dotnet", "Raja_Portfolio.Server.dll"]
