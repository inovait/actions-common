# Common Actions

A set of reusable GitHub actions that can be used to simplify your workflows.

## Android

### Setup Android build environment

Setup java, Android SDK and enable dependency caching.

Example usage:

```yaml
- uses: inovait/actions-common/android-setup@39daea3d0c0e98246ef3dea27d3f9c169c86c18f
```

### Run with emulator

Start Android emulator and run specified command when emulator is active. When your command finishes, emulator is stopped. 

For now, this action always starts API 30 ADT emulator image. We can add multiple emulator types later, if needed.

Example usage:

```yaml
- name: Run Android Emulator tests
  uses: inovait/actions-common/android-run-with-emulator@11c3bbccb3ca9b203f5a1dc125ef5e3547d1c077
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
    uses: inovait/actions-common/changelog-since-last-build@11c3bbccb3ca9b203f5a1dc125ef5e3547d1c077
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
    uses: inovait/actions-common/spotlight-publish@11c3bbccb3ca9b203f5a1dc125ef5e3547d1c077
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

## Jira

### Get Jira tickets mentioned in commits

Inputs:

* `from` (Required) - Commit to start generating changelog from (exclusive)
* `to` (Optional) - Last commit (inclusive) to generate changelog from
* `onlyResolvedTickets` (Optional) - When set to `true`, only include tickets where ticket mention in commit is preceded by a [resolution keyword](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword) (for example `fixes ABC-123` instead of just `ABC-123`)

Outputs:

* `tickets` - Comma-separated list of tickets

```yaml
- name: Get jira tickets
  uses: inovait/actions-common/jira-get-tickets-from-commits@fc52f3b65dc2ad944f5eada357b583b093bd7ff4
  id: jira-tickets
  with:
    from: 13d7b87c7f6ac5d2e0064a229cf6b2e97766d97f
    to: 1b1a0f2f5790837d0986934ab080a02123cfd763
- run: 'echo Jira tickets: ${{ steps.jira-tickets.outputs.tickets }}'
```

### Get Jira tickets mentioned in commits since last successful build

Action behaves identically to the above jira action, except that you do not pass `from` and `to` inputs.

```yaml
- name: Get jira tickets
  uses: inovait/actions-common/jira-get-tickets-since-last-build@fc52f3b65dc2ad944f5eada357b583b093bd7ff4
  id: jira-tickets
- run: 'echo Jira tickets: ${{ steps.jira-tickets.outputs.tickets }}'
```

### Login

Before you do any of the below actions, you have to login to Jira. See [Jira Login](https://github.com/marketplace/actions/jira-login) for more info.

Example usage:

```yaml
- name: Login to Jira
  uses: atlassian/gajira-login@40890b68ae12fed6b67ed1d0e31e9fd1912746ac
  env:
    JIRA_BASE_URL: ${{ secrets.JIRA_BASE_URL }}
    JIRA_USER_EMAIL: ${{ secrets.JIRA_USER_EMAIL }}
    JIRA_API_TOKEN: ${{ secrets.JIRA_API_TOKEN }}
```

### Add a comment to jira ticket(s)

Inputs:

* `tickets` - Comma-separated list of tickets. Can be output of the above "get jira tickets" task.
* `jql` - [JQL](https://gist.github.com/emmajane/59321345a81a4f5837c0) query. When specified, action will add a comment to all tickets that match this JQL.  
  (either `tickets` or `jql` is required)
* `comment` - Comment to make. Can be in [Atlassian Document Format](https://developer.atlassian.com/cloud/jira/platform/apis/document/playground/).

Example usage:

```yaml
- name: Make a jira comment
  uses: inovait/actions-common/jira-comment@9bf1c4cf62ef568dec51efac94b1833d74dfc53f
  with:
    tickets: JT-1,JT-2
    comment: 'This ticket is included in build 1.2.${{ env.BUILD_NUMBER }}.'
```

### Transition jira ticket(s)

Inputs:

* `tickets` - Comma-separated list of tickets to transition. Can be output of the above "get jira tickets" task.
* `jql` - [JQL](https://gist.github.com/emmajane/59321345a81a4f5837c0) query. When specified, 
action will consider all tickets that match this JQL for transition.  
  (either `tickets` or `jql` is required)
* `from` - (Optional) Only transition tickets that are currently in this state
* `to` - State to transition to

Example usage:

```yaml
- name: Transition tickets to test
  uses: inovait/actions-common/jira-transition@9bf1c4cf62ef568dec51efac94b1833d74dfc53f
  with:
    tickets: JT-1,JT-2
    from: 'In Progress'
    to: 'Ready to Test'
```

### Update fields on jira ticket(s)

Inputs:

* `tickets` - Comma-separated list of tickets to update. Can be output of the above "get jira tickets" task.
* `jql` - [JQL](https://gist.github.com/emmajane/59321345a81a4f5837c0) query. When specified, 
action will update all tickets that match this JQL for transition.  
(either `tickets` or `jql` is required)

Possible fields to update:

`fixVersion`, `priority`

Example usage:

```yaml
- name: Update jira tickets
  uses: inovait/actions-common/jira-update@9bf1c4cf62ef568dec51efac94b1833d74dfc53f
  with:
    tickets: JT-1,JT-2
    fixVersion: '1.0.0'
    priority: 'Low'
```

# Versioning

## Bump version

Increase semantic version. Version can be input in two ways:

* `version` - direct old version input, feel free to use github action contexts. 
New version can be accessed using `output` action output.
* `versionFile` - old version is read from the specified text file, and new version is written back to the file

You also need to specify `increment` which tells the action which part of the version should be bumped. 
Can be `major`, `minor`, `patch` or `auto`.

In `auto` mode, release type will be automatically selected based on commit messages from provided range. Commits need to follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) spec for this to work. You also need to specify these in auto mode:

* `from` (Required) - Commit to start searching from (exclusive)
* `to` (Optional) - Last commit (inclusive) to include in search


Example usage:

```yaml
- name: Bump minor version
  uses: inovait/actions-common/bump-version@abf8eb278d434f0a8cab7fa05b4850c8550cdb29
  with:
    versionFile: 'version.txt'
    increment: minor
```

```yaml
- name: Bump major version from file
  id: version-step
  uses: inovait/actions-common/bump-version@abf8eb278d434f0a8cab7fa05b4850c8550cdb29
  with:
    version: '1.0.0'
    increment: major
- echo: 'New version: ${{ steps.version-step.outputs.version }}'
```

```yaml
- name: Bump version from commits
  id: version-step
  uses: inovait/actions-common/bump-version@abf8eb278d434f0a8cab7fa05b4850c8550cdb29
  with:
    versionFile: 'version.txt'
    increment: auto
    from: 13d7b87c7f6ac5d2e0064a229cf6b2e97766d97f
    to: 1b1a0f2f5790837d0986934ab080a02123cfd763
```

## Bump version from commits since last build

Action behaves identically to the above version bump action, except that `increment` is always `auto` and 
you do not pass `from` and `to` inputs - they will be automatically populated to include all commits made since last successful build of this workflow.

```yaml
- name: Bump version from commits since last build
  id: version-step
  uses: inovait/actions-common/bump-version-since-last-build@abf8eb278d434f0a8cab7fa05b4850c8550cdb29
  with:
    versionFile: 'version.txt'
```
