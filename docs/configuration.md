| Name                  | Description                                                             | Type          | Default Value |
| ---                   | ---                                                                     | ---           | ---           |
| `LOAD_JOBS_FROM_FILE` | Indicates whether some default jobs should be loaded from files or not. | boolean       | false         |
| `JOB_FILES`           | Comma separated list of extra files to load from.                       | string        | ''            |


## Loading job seeds

- If `LOAD_JOBS_FROM_FILE` all `yml` files in `/opt/scheduler/src/config/job-seeds` will be loaded.
- (Not implemented yet) On top of that one can define additional files to be loaded by passing those in the env variable `JOB_FILES`.
