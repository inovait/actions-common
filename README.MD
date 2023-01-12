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

### Generate changelog since last successful build

Action will generate Markdown changelog from all commits made since the last successful Workflow on this branch.

Action behaves identically to the above changelog action, except that you do not pass `from` and `to` inputs.

Example usage:

```yaml
  - name: Generate Changelog
    uses: inovait/actions-common/changelog-since-last-build@main
    with:
      git_commit_url_prefix: 'https://github.com/inovait/actions-common/commit/'
      jira_url: 'https://inova-it.atlassian.net/'
      target_file: "CHANGELOG.MD"
```

## Publishing

### Spotlight

Action is used to publish files to Spotlight.

Example usage:

```yaml
  - name: Publish to spotlight
    uses: inovait/actions-common/spotlight-publish@main
    with:
      api_key: '...'
      destination: 'release'
      version: "1.2.3"
      track: "Develop"
      files: |
        build/output/**/*.apk
        CHANGELOG.MD
```

Arguments:

* `api_key` - your API key for Spotlight, ideally stored in [Action Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
* `destination` - Either `workspace` (publish files to Spotlight workspace) or `release` (make a new Spotlight release)
* `files` - List of files to upload. You can use globs (**, *) and you can specify multiple files by specifying them in multiple lines.

Extra arguments when `destination` is set to `release`:

* `version` - Version to publish in semver format. Can be omitted when uploading ipa files, otherwise mandatory.
* `track` - Name of the release track. Can be omitted when uploading ipa files, otherwise mandatory.
