# ---------- BUILD STAGE ----------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Install Node.js (IMPORTANT)
RUN apt-get update && apt-get install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

WORKDIR /app

# Copy everything
COPY . .

# ---------- BUILD ANGULAR ----------
WORKDIR /app/raja_portfolio.client
RUN npm install
RUN npm run build -- --configuration production

# ---------- BUILD .NET ----------
WORKDIR /app/Raja_Portfolio.Server
RUN dotnet restore
RUN dotnet publish -c Release -o out

# ---------- RUNTIME ----------
FROM mcr.microsoft.com/dotnet/aspnet:8.0

WORKDIR /app
COPY --from=build /app/Raja_Portfolio.Server/out .

EXPOSE 8080

ENTRYPOINT ["dotnet", "Raja_Portfolio.Server.dll"]
