import * as core from '@actions/core'
import * as fs from 'fs/promises'
import { gatherCommits } from 'action_common_libs/src/commit-gathering'
import { Repository } from 'nodegit'
import { getVersionToBump } from './automatic_version_detector'
import semver, { ReleaseType } from 'semver/preload'

// These require statements are needed as a workaround for the https://github.com/vercel/ncc/issues/1024
require('nodegit/dist/repository.js')
require('nodegit/dist/commit.js')
require('nodegit/dist/oid.js')

async function main(): Promise<void> {
  try {
    const versionRaw: string = core.getInput('version', { trimWhitespace: true })
    const versionFile: string = core.getInput('versionFile', { trimWhitespace: true })
    let increment: string = core.getInput('increment', {
      trimWhitespace: true,
      required: true
    })
    const toCommit: string = core.getInput('to', { trimWhitespace: true })
    const fromCommit: string = core.getInput('from', { trimWhitespace: true })

    let oldVersion: string
    if (versionFile.length > 0) {
      oldVersion = (await fs.readFile(versionFile)).toString().trim()
    } else if (versionRaw.length > 0) {
      oldVersion = versionRaw
    } else {
      core.setFailed('version or versionFile must be set')
      return
    }

    core.info(`Old version: ${oldVersion}`)

    const parsedVersion = semver.parse(oldVersion)
    if (parsedVersion == null) {
      core.setFailed(`'${oldVersion}' is not a valid semantic version`)
      return
    }

    if (increment === 'auto') {
      if (toCommit.length === 0 || fromCommit.length === 0) {
        core.setFailed('if increment is set to auto, you must specify from and to')
        return
      }

      const repo = await Repository.open('.')
      const commits = await gatherCommits(repo, fromCommit, toCommit)
      increment = getVersionToBump(commits)
      core.info(`Detected ${increment} release type from commits`)
    }

    let releaseType: ReleaseType
    if (increment === 'major') {
      releaseType = 'major'
    } else if (increment === 'minor') {
      releaseType = 'minor'
    } else if (increment === 'patch') {
      releaseType = 'patch'
    } else {
      core.setFailed(`Unknown release type ${increment}`)
      return
    }

    const newVersion = parsedVersion.inc(releaseType).format()
    core.info(`New version: ${newVersion}`)

    core.setOutput('version', newVersion)

    if (versionFile.length > 0) {
      await fs.writeFile(versionFile, newVersion)
    }
  } catch (error: any) {
    console.log(error)
    core.setFailed(error.message)
  }
}

void main()
