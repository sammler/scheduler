
### Docker Run

```
$ docker run sammlerio/scheduler
```

### Docker Compose

```
version: '3.3'
services:

  nats-streaming:
    image: nats-streaming
    ports:
      - "4222:4222"
      - "4223:4223"
      - "8223:8223"
      - "8222:8222"
    volumes:
      - ./.datastore:/datastore
    command: [
      "-m", "8222",
      "--store", "FILE",
      "--dir", "datastore"
  
  scheduler:
    image: sammlerio/scheduler
    ports:
      - "3001:3001"
    environment:
      - NATS_URI=nats://nats-streaming:4222
      - LOAD_JOBS_FROM_FILE=true
      - JOB_FILES=file1.yml,file2.yml
```