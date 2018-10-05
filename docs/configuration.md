| Name                  | Description                                                             | Type          | Default Value           |
| ---                   | ---                                                                     | ---           | ---                     |
| `LOAD_JOBS_FROM_FILE` | Indicates whether some default jobs should be loaded from files or not. | boolean       | `false`                 |
| `JOB_FILES`           | Comma separated list of extra files to load from.                       | string        | ''                      |
| `NATS_URI`            | Resource location of NATS                                               | string        | `nats://localhost:4222` |
| `PORT`                | Port of the service.                                                    | string        | `3001`                  |


## Loading job seeds

- If `LOAD_JOBS_FROM_FILE` all `yml` files in `/opt/scheduler/src/config/job-seeds` will be loaded.
- (Not implemented yet) On top of that one can define additional files to be loaded by passing those in the env variable `JOB_FILES`.


## A job definition file

```yaml
jobs:
  - name: heartbeat       # The name of a job
    enabled: true         # Whether this job is enabled or not
    strategy: cron        # Default strategy for this job, by default only `cron` for now.
    cron:                 # All the cron related settings.
      def: "* * * * * *"  # Definition of the cron job.
    nats:
      subject: foo        # Nats' subject.
    data:                 # Various payload settings, passed over to nats.
      setting1: foo           
      setting2: bar
      setting3: baz
    
```