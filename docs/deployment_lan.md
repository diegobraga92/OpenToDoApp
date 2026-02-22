# OpenToDoApp LAN Deployment (Server: 192.168.3.12)

This project is configured so backend + web run in Docker on a LAN server.

## Services (e.g.)

- Web UI: `http://192.168.3.12`
- Backend API: `http://192.168.3.12:3000`

## Manual steps to run on the server

1. Install Docker Engine + Docker Compose plugin on the server.
2. Clone this repository on the server.
3. From repo root, run:

```bash
docker compose up -d --build
```

4. Verify:

```bash
docker compose ps
curl http://192.168.3.12:3000/lists
```

5. (If needed) open firewall ports:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 3000/tcp
```

## Android notes

- Android app is configured to use `http://192.168.3.12:3000/lists` for backend availability checks.
- Install APK on devices normally.