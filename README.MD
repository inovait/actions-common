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

## Changelog

### Generate changelog from specified commit range

(See [changelog's README.MD](git-changelog-generator/README.MD) for more info)

Action will generate Markdown changelog from list of commits. 

Example usage:

```yaml
  - name: Generate Changelog
    uses: inovait/actions-common/git-changelog-generator@46744a98ddf47d8ec6c99e0b285a040c8ef16723
    with:
      from: efe8dc92136a28e3f9ace97e7af9ae456fd9e2d0
      to: e31a0104ee0f9831e061a62c555c9db211885b1f
      git_commit_url_prefix: 'https://github.com/inovait/actions-common/commit/'
      jira_url: 'https://inova-it.atlassian.net/'
      target_file: "CHANGELOG.MD"
```
