## Required services (dependencies)

- `make up-deps` - Start required services.
- `make up-deps-i` - Start required services (interactive mode).
- `make down-deps` - Stop required services.
- `clean-deps` - Step required services + clean-up nats storage.

The commands above use the docker file `docker-compose.deps.yml`.

