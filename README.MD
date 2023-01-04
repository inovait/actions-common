# Common Actions

A set of reusable GitHub actions that can be used to simplify your workflows.

## Android

### Setup Android build environment

Setup java, Android SDK and enable dependency caching.

Example usage:

```yaml
- uses: inovait/actions-common/android-setup@main
```

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
