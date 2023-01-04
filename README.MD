# Common Actions

A set of reusable GitHub actions that can be used to simplify your workflows.

## Android

### Run with emulator

Start Android emulator and run specified command when emulator is active. When your command finishes, emulator is stopped. 

For now, this action always starts API 30 ADT emulator image. We can add multiple emulator types later, if needed.

Example usage:

```yaml
- name: Run Android Emulator tests
  uses: inovait/actions-common/android-run-with-emulator@main
  with:
    command: './gradlew connectedAndroidTest'
```
