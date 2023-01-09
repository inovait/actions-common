import { test } from '@jest/globals'
import { createFakeCommit } from './TestCommit'
import { generateChangelog } from '../src/generator'
import * as fs from 'fs'

test('generate changelog for commits without semantic data', () => {
  const commits =
    [
      createFakeCommit(
        'abd0ae703769b889814fc1c896b55e96a1e9dbce',
        'lock OnDemandProvider into mutex',
        '2018-11-20T08:29:38+01:00',
      ),
      createFakeCommit(
        'fa5e0250f59bf5c8acdab7ae5e8070459a321a1d',
        'add JUnit dependency',
        '2018-11-20T07:57:01+01:00',
      ),
      createFakeCommit(
        '962b3eb5cd9c6c9673ab2d818a560fe1a18765bb',
        'use SupervisorJob on ViewModel',
        '2018-11-20T07:48:42+01:00',
      ),
      createFakeCommit(
        '340762ccc0ac26ab71c0579ac1f2a61211c0140c',
        'make LiveData observing utils inline',
        '2018-11-07T07:48:01+01:00',
      ),
      createFakeCommit(
        '1ef779cdc35cf5844bb78965658cb818901a61a6',
        'remove ResourceLiveData.setValue deprecation',
        '2018-11-07T07:43:33+01:00',
      ),
      createFakeCommit(
        '017ffa996837a25851f695203320cc268a4fdb2e',
        'add SectionRecyclerAdapter.getInnerPosition docs',
        '2018-11-07T07:42:04+01:00',
      ),
      createFakeCommit(
        '33a28b0fcf73dabf01395488ac1c4663ef06b162',
        'add RxCoroutinesTimeMachine',
        '2018-11-05T14:20:25+01:00',
      ),
      createFakeCommit(
        '817668bf18e9a8292a6baf87740a583b95f7173f',
        'PreferenceProperty null default crash',
        '2018-09-26T13:37:48+02:00',
      ),
    ]

  const expected = fs.readFileSync(
    'test/test-files/example-commits-without-semantic-data-changelog.txt'
  ).toString().trim()

  const actual = generateChangelog(commits, {
    gitCommitUrlPrefix: 'http://hydra/testProject/commit/'
  })

  expect(actual).toBe(expected)
})

test('generate changelog for a minor release', () => {
  const commits =
    [createFakeCommit(
      'abd0ae703769b889814fc1c896b55e96a1e9dbce',
      'fix: lock OnDemandProvider into mutex',
      '2018-11-20T08:29:38+01:00',
    ),
      createFakeCommit(
        'fa5e0250f59bf5c8acdab7ae5e8070459a321a1d',
        'test(retrofit): add JUnit dependency',
        '2018-11-20T07:57:01+01:00',
      ),
      createFakeCommit(
        '962b3eb5cd9c6c9673ab2d818a560fe1a18765bb',
        'fix: use SupervisorJob on ViewModel',
        '2018-11-20T07:48:42+01:00',
      ),
      createFakeCommit(
        '340762ccc0ac26ab71c0579ac1f2a61211c0140c',
        'feat: make LiveData observing utils inline',
        '2018-11-07T07:48:01+01:00',
      ),
      createFakeCommit(
        '1ef779cdc35cf5844bb78965658cb818901a61a6',
        'feat: remove ResourceLiveData.setValue deprecation',
        '2018-11-07T07:43:33+01:00',
      ),
      createFakeCommit(
        '017ffa996837a25851f695203320cc268a4fdb2e',
        'docs: add SectionRecyclerAdapter.getInnerPosition docs',
        '2018-11-07T07:42:04+01:00',
      ),
      createFakeCommit(
        'a1a2f8b747ac2f93afd03455da27d1008277050b',
        'docs: add experimental suppress explanation',
        '2018-11-07T07:30:23+01:00',
      ),
      createFakeCommit(
        '33a28b0fcf73dabf01395488ac1c4663ef06b162',
        'feat: add RxCoroutinesTimeMachine',
        '2018-11-05T14:20:25+01:00',
      ),
      createFakeCommit(
        'c5062acebab8775afb400f42b27ee5dcc6ef4106',
        'test: add RxCoroutinesTimeMachine',
        '2018-11-05T08:49:12+01:00',
      ),
      createFakeCommit(
        '817668bf18e9a8292a6baf87740a583b95f7173f',
        'fix(android): PreferenceProperty null default crash',
        '2018-09-26T13:37:48+02:00',
      ),
    ]

  const expected = fs.readFileSync('test/test-files/example-minor-release-changelog.txt').toString().trim()
  const actual = generateChangelog(commits, {
    gitCommitUrlPrefix: 'http://hydra/testProject/commit/'
  })

  expect(actual).toBe(expected)
})
