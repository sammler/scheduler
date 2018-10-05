
### Docker Run

```
$ docker run sammlerio/scheduler
```

### Docker Compose

```
version: '3.3'
services:
  
  scheduler:
    image: sammlerio/scheduler
    ports:
      - "3001:3001"
    environment:
      - NATS_URI=nats://nats:4222
      - LOAD_JOBS_FROM_FILE=true
      - JOB_FILES=file1.yml,file2.yml
```