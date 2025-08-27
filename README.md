# Making Schedule app up and running

1. check `.env.example`, rename it to `.env`, adjust variables if needed
2. for the first run:

- `docker compose --env-file .env up --build`

- then `DATABASE_SEED_URL=postgresql://{DB_USERNAME}:{DB_PASSWORD}@localhost:5432/{DB_NAME} npm run prisma:seed npm run prisma:seed`

2. for all the next runs

`docker compose --env-file .env up`

## Potential problems
`platform: linux/amd64` in compose.yaml file is needed to run under ARM platform. If you're using Windows platform and not an ARM platform - remove it.
