import * as core from '@actions/core'
import * as glob from '@actions/glob'
import semver from 'semver/preload'

import path from 'path'
import sanitize from 'sanitize-filename'

/* eslint-disable @typescript-eslint/no-var-requires */
const inspect = require('@inovait/spotlight-cli/src/inspect.js')
const Inuit = require('@inovait/spotlight-cli/src/inuit.js')

const BASE_URL = process.env.SPOTLIGHT_URL ?? 'https://spotlight.inova.si/f'

interface InuitInspectionResult {
  buildInfo: InuitBuildInfo
  fileList: InuitFile[]
}

interface InuitBuildInfo {
  name: string
  version: string
}

interface InuitFile {
  file: string
  contentType?: string
  metadata: any
}

async function main(): Promise<void> {
  try {
    const apiKey: string = core.getInput('api_key', { required: true })
    const destination: string = core.getInput('destination', { required: true })
    const fileStrings: string = core.getInput('files', { required: true })

    const files = await (await glob.create(fileStrings)).glob()
    if (files.length === 0) {
      core.setFailed('No files found to publish')
      return
    }

    const inuit = new Inuit(
      {
        apiKey,
        baseUrl: BASE_URL
      }
    )

    if (destination === 'workspace') {
      await uploadToWorkspace(inuit, files)
    } else if (destination === 'release') {
      await uploadRelease(inuit, files)
    } else {
      core.setFailed(`Unknown destination '${destination}'. Must be either 'release' or 'workspace'.`)
      return
    }
  } catch (error: any) {
    console.log(error)
    core.setFailed(error.message)
  }
}

async function uploadRelease(inuit: typeof Inuit, files: string[]): Promise<void> {
  const overridenVersion: string | undefined = core.getInput('version')
  const overridenName: string | undefined = core.getInput('track')

  const inspectionResult: InuitInspectionResult = await inspect.inspectBuildFilesForUpload(files)
  const version = overridenVersion ?? inspectionResult.buildInfo.version
  if (version === undefined) {
    core.setFailed('version not specified.')
    return
  }

  if (semver.valid(version) == null) {
    core.setFailed(`Version '${version}' is not a valid semver version. See https://semver.org/ for more information.`)
    return
  }

  const releaseName = overridenName ?? inspectionResult.buildInfo.name
  if (semver.valid(version) == null) {
    core.setFailed('release_name not specified.')
    return
  }

  const filesToUpload = inspectionResult.fileList.map((file) => {
    return {
      src: file.file,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      dest: path.posix.join('builds', sanitize(releaseName), semver.clean(version)!, path.basename(file.file)),
      ...file
    }
  })

  await inuit.uploadAll(filesToUpload)
}

async function uploadToWorkspace(inuit: typeof Inuit, files: string[]): Promise<void> {
  const inspectionResult: InuitFile[] = await inspect.inspectContentFilesForUpload(files)

  const filesToUpload = inspectionResult.map((file) => {
    return {
      src: file.file,
      dest: path.posix.join('ws', inspect.getPublishDestPath(process.cwd(), file.file)),
      ...file
    }
  })

  await inuit.uploadAll(filesToUpload)
}

void main()
