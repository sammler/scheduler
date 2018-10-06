### Required services (dependencies)

The commands below will bring all up required services, but not the scheduler itself.  
Use it e.g. prior to run `npm run start`.

- `make up-deps` - Start required services.
- `make up-deps-i` - Start required services (interactive mode).
- `make down-deps` - Stop required services.
- `clean-deps` - Step required services + clean-up nats storage.

The commands above use the docker file `docker-compose.deps.yml`.

### Scheduler

- `npm run start` - Start the scheduler service.
- `npm run start:watch` - Start the scheduler in watch mode.

### Full stack

Run all services including the scheduler service.

- `up` - Start all services.
- `up-i` - Start all services in interactive mode.
- `down` - Tear down all services.
- `clean` - Tear down all services + delete the NATS storage.

The commands above use the docker file `docker-compose.yml`.