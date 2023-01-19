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

test('generate changelog for a major release', () => {
  const commits =
    [createFakeCommit(
      'abd0ae703769b889814fc1c896b55e96a1e9dbce',
      'fix: lock OnDemandProvider into mutex',
      '2018-11-20T08:29:38+01:00',
      'This prevents thread synchronization errors.\n    Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
    ),
      createFakeCommit(
        'fa5e0250f59bf5c8acdab7ae5e8070459a321a1d',
        'test(retrofit): add JUnit dependency',
        '2018-11-20T07:57:01+01:00',
        'Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        '962b3eb5cd9c6c9673ab2d818a560fe1a18765bb',
        'fix: use SupervisorJob on ViewModel',
        '2018-11-20T07:48:42+01:00',
        'This makes all jobs created by VM independent\n    Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        'a7625ec2d7ab115a52d4471a203b7245d7382163',
        'fix: TimeProvider timezone was always UTC',
        '2018-11-20T07:40:03+01:00',
        'BREAKING CHANGE\n    Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        '6453b08cd728cc0da27ce8220252d4030808adf7',
        'feat: migrate to AndroidX',
        '2018-11-07T09:14:30+01:00',
        'BREAKING CHANGE\n    Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        '340762ccc0ac26ab71c0579ac1f2a61211c0140c',
        'feat: make LiveData observing utils inline',
        '2018-11-07T07:48:01+01:00',
        'Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        '1ef779cdc35cf5844bb78965658cb818901a61a6',
        'feat: remove ResourceLiveData.setValue deprecation',
        '2018-11-07T07:43:33+01:00',
        'Synchronous updating of LiveData still has its own uses, provided it is called on UI thread and outside any general try/catch blocks.\n    Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        '017ffa996837a25851f695203320cc268a4fdb2e',
        'docs: add SectionRecyclerAdapter.getInnerPosition docs',
        '2018-11-07T07:42:04+01:00',
        'Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        '08d81e6c45a22829b98bfae93de7d037c16efa75',
        'refactor: remove SectionRecyclerAdapter detach',
        '2018-11-07T07:40:30+01:00',
        'This method caused no small amount of bugs. Instead of detaching, users of this adapter should just set count of unwanted section to 0.\n    BREAKING CHANGE\n    Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        '2721cd883b0e94e25e936751fd78ecd17b3127b3',
        'refactor: remove PaginatedQuery.reset',
        '2018-11-07T07:38:39+01:00',
        'This method caused some implementation issues with no clear benefits (caller can still initiate query again and receive fresh one)\n    BREAKING CHANGE\n    Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        '5b10ff53701d2acf787fc408c130a2bc07cfd994',
        'refactor: delete unused CenterFirstDecoration',
        '2018-11-07T07:34:08+01:00',
        'BREAKING CHANGE\n    Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        'dff95f363f60edfcbdcabc72561985b50e1ea721',
        'feat: add CoroutineScope to CoroutineViewModel',
        '2018-11-07T07:33:39+01:00',
        'BREAKING CHANGE\n    Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        'a1a2f8b747ac2f93afd03455da27d1008277050b',
        'docs: add experimental suppress explanation',
        '2018-11-07T07:30:23+01:00',
        'Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        'e85afaa41361d5b969061d5fef786aa4fc6abbbf',
        'feat: move dispatchers proxy to common class',
        '2018-11-06T08:00:20+01:00',
        'BREAKING CHANGE\n    this is part of the WIP process to fully migrate kotlinova to Kotlin 1.3 with stable coroutines\n    Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        'ec1c05feb01408df9e20b1a64606c020da55aeb5',
        'fix: rewrite OnDemandProvider with new coroutines',
        '2018-11-05T14:21:45+01:00',
        'BREAKING CHANGE\n    this is part of the WIP process to fully migrate kotlinova to Kotlin 1.3 with stable coroutines\n    Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        '33a28b0fcf73dabf01395488ac1c4663ef06b162',
        'feat: add RxCoroutinesTimeMachine',
        '2018-11-05T14:20:25+01:00',
        'Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        '41d598842a6506d8b2e9b1523eb09742140d3bbe',
        'refactor: android dispatcher returns CoroutineContext',
        '2018-11-05T14:19:49+01:00',
        'BREAKING CHANGE\n    this is part of the WIP process to fully migrate kotlinova to Kotlin 1.3 with stable coroutines\n    Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        'c5062acebab8775afb400f42b27ee5dcc6ef4106',
        'test: add RxCoroutinesTimeMachine',
        '2018-11-05T08:49:12+01:00',
      ),
      createFakeCommit(
        'fcacdec1349e91f595002ba79085a35d4ac420a5',
        'feat: change dispatcher override to return CoroutineContext',
        '2018-11-05T08:48:49+01:00',
        'BREAKING CHANGE\n    this is part of the WIP process to fully migrate kotlinova to Kotlin 1.3 with stable coroutines',
      ),
      createFakeCommit(
        '9abca5d3f84b40d727020b692bdfafd69651b232',
        'feat: update coroutines to 1.0.0',
        '2018-11-02T13:23:58+01:00',
        'BREAKING CHANGE\n    this is part of the WIP process to fully migrate kotlinova to Kotlin 1.3 with stable coroutines',
      ),
      createFakeCommit(
        '2c42e53e1b35efddc01fc49f563fa3c2d7934242',
        'feat: update coroutines to 0.30.2-eap13 and kotlin to 1.3',
        '2018-11-02T10:00:39+01:00',
        'BREAKING CHANGE\n    this is part of the WIP process to migrate kotlinova to Kotlin 1.3 with stable coroutines',
      ),
      createFakeCommit(
        '6d12a715b58eac872c76210fc599685cee2642c7',
        'feat: update coroutines to 0.30.2',
        '2018-11-02T09:51:04+01:00',
        'BREAKING CHANGE\n    this is part of the WIP process to migrate kotlinova to Kotlin 1.3 with stable coroutines',
      ),
      createFakeCommit(
        '817668bf18e9a8292a6baf87740a583b95f7173f',
        'fix(android): PreferenceProperty null default crash',
        '2018-09-26T13:37:48+02:00',
        'This fixes bug where PreferenceProperty type is one of the Java\'s primitive types (int, long etc.) and its default value is null. Crash occures when trying to read non-null value from the preferences.',
      )]

  const expected = fs.readFileSync('test/test-files/example-major-release-changelog.txt').toString().trim()
  const actual = generateChangelog(commits, {
    gitCommitUrlPrefix: 'http://hydra/testProject/commit/'
  })

  expect(actual).toBe(expected)
})

test('generate changelog for a major release with exclamation syntax', () => {
  const commits =
    [createFakeCommit(
      'abd0ae703769b889814fc1c896b55e96a1e9dbce',
      'fix: lock OnDemandProvider into mutex',
      '2018-11-20T08:29:38+01:00',
      'This prevents thread synchronization errors.\n    Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
    ),
      createFakeCommit(
        'fa5e0250f59bf5c8acdab7ae5e8070459a321a1d',
        'test(retrofit): add JUnit dependency',
        '2018-11-20T07:57:01+01:00',
        'Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        '962b3eb5cd9c6c9673ab2d818a560fe1a18765bb',
        'fix: use SupervisorJob on ViewModel',
        '2018-11-20T07:48:42+01:00',
        'This makes all jobs created by VM independent\n    Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        'a7625ec2d7ab115a52d4471a203b7245d7382163',
        'fix!: TimeProvider timezone was always UTC',
        '2018-11-20T07:40:03+01:00'
      ),
      createFakeCommit(
        '6453b08cd728cc0da27ce8220252d4030808adf7',
        'feat!: migrate to AndroidX',
        '2018-11-07T09:14:30+01:00'
      ),
      createFakeCommit(
        '340762ccc0ac26ab71c0579ac1f2a61211c0140c',
        'feat: make LiveData observing utils inline',
        '2018-11-07T07:48:01+01:00',
        'Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        '1ef779cdc35cf5844bb78965658cb818901a61a6',
        'feat: remove ResourceLiveData.setValue deprecation',
        '2018-11-07T07:43:33+01:00',
        'Synchronous updating of LiveData still has its own uses, provided it is called on UI thread and outside any general try/catch blocks.\n    Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        '017ffa996837a25851f695203320cc268a4fdb2e',
        'docs: add SectionRecyclerAdapter.getInnerPosition docs',
        '2018-11-07T07:42:04+01:00',
        'Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        '08d81e6c45a22829b98bfae93de7d037c16efa75',
        'refactor!: remove SectionRecyclerAdapter detach',
        '2018-11-07T07:40:30+01:00',
        'This method caused no small amount of bugs. Instead of detaching, users of this adapter should just set count of unwanted section to 0.\n      Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        '2721cd883b0e94e25e936751fd78ecd17b3127b3',
        'refactor!: remove PaginatedQuery.reset',
        '2018-11-07T07:38:39+01:00',
        'This method caused some implementation issues with no clear benefits (caller can still initiate query again and receive fresh one)\n     Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        '5b10ff53701d2acf787fc408c130a2bc07cfd994',
        'refactor!: delete unused CenterFirstDecoration',
        '2018-11-07T07:34:08+01:00'
      ),
      createFakeCommit(
        'dff95f363f60edfcbdcabc72561985b50e1ea721',
        'feat!: add CoroutineScope to CoroutineViewModel',
        '2018-11-07T07:33:39+01:00'
      ),
      createFakeCommit(
        'a1a2f8b747ac2f93afd03455da27d1008277050b',
        'docs: add experimental suppress explanation',
        '2018-11-07T07:30:23+01:00',
        'Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        'e85afaa41361d5b969061d5fef786aa4fc6abbbf',
        'feat!: move dispatchers proxy to common class',
        '2018-11-06T08:00:20+01:00',
        'this is part of the WIP process to fully migrate kotlinova to Kotlin 1.3 with stable coroutines\n    Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        'ec1c05feb01408df9e20b1a64606c020da55aeb5',
        'fix!: rewrite OnDemandProvider with new coroutines',
        '2018-11-05T14:21:45+01:00',
        'this is part of the WIP process to fully migrate kotlinova to Kotlin 1.3 with stable coroutines\n    Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        '33a28b0fcf73dabf01395488ac1c4663ef06b162',
        'feat: add RxCoroutinesTimeMachine',
        '2018-11-05T14:20:25+01:00',
        'Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        '41d598842a6506d8b2e9b1523eb09742140d3bbe',
        'refactor!: android dispatcher returns CoroutineContext',
        '2018-11-05T14:19:49+01:00',
        'this is part of the WIP process to fully migrate kotlinova to Kotlin 1.3 with stable coroutines\n    Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        'c5062acebab8775afb400f42b27ee5dcc6ef4106',
        'test: add RxCoroutinesTimeMachine',
        '2018-11-05T08:49:12+01:00',
      ),
      createFakeCommit(
        'fcacdec1349e91f595002ba79085a35d4ac420a5',
        'feat!: change dispatcher override to return CoroutineContext',
        '2018-11-05T08:48:49+01:00',
        'this is part of the WIP process to fully migrate kotlinova to Kotlin 1.3 with stable coroutines',
      ),
      createFakeCommit(
        '9abca5d3f84b40d727020b692bdfafd69651b232',
        'feat!: update coroutines to 1.0.0',
        '2018-11-02T13:23:58+01:00',
        '   this is part of the WIP process to fully migrate kotlinova to Kotlin 1.3 with stable coroutines',
      ),
      createFakeCommit(
        '2c42e53e1b35efddc01fc49f563fa3c2d7934242',
        'feat!: update coroutines to 0.30.2-eap13 and kotlin to 1.3',
        '2018-11-02T10:00:39+01:00',
        ' this is part of the WIP process to migrate kotlinova to Kotlin 1.3 with stable coroutines',
      ),
      createFakeCommit(
        '6d12a715b58eac872c76210fc599685cee2642c7',
        'feat!: update coroutines to 0.30.2',
        '2018-11-02T09:51:04+01:00',
        ' this is part of the WIP process to migrate kotlinova to Kotlin 1.3 with stable coroutines',
      ),
      createFakeCommit(
        '817668bf18e9a8292a6baf87740a583b95f7173f',
        'fix(android): PreferenceProperty null default crash',
        '2018-09-26T13:37:48+02:00',
        'This fixes bug where PreferenceProperty type is one of the Java\'s primitive types (int, long etc.) and its default value is null. Crash occures when trying to read non-null value from the preferences.',
      )]

  const expected = fs.readFileSync('test/test-files/example-major-release-changelog.txt').toString().trim()
  const actual = generateChangelog(commits, {
    gitCommitUrlPrefix: 'http://hydra/testProject/commit/'
  })

  expect(actual).toBe(expected)
})

test('hide Jira tickets if Jira URL is not provided', () => {
  const commits =
    [      createFakeCommit(
      'abd0ae703769b889814fc1c896b55e96a1e9dbce',
      'fix: lock OnDemandProvider into mutex',
      '2018-11-20T08:29:38+01:00',
      'This prevents thread synchronization errors.\n    Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
    ),
      createFakeCommit(
        'fa5e0250f59bf5c8acdab7ae5e8070459a321a1d',
        'test(retrofit): add JUnit dependency',
        '2018-11-20T07:57:01+01:00',
        'Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        '962b3eb5cd9c6c9673ab2d818a560fe1a18765bb',
        '[HD-123] feat: use SupervisorJob on ViewModel',
        '2018-11-20T07:48:42+01:00',
        'This makes all jobs created by VM independent\n    Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        '340762ccc0ac26ab71c0579ac1f2a61211c0140c',
        'feat: make LiveData observing utils inline',
        '2018-11-07T07:48:01+01:00',
        'Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        '1ef779cdc35cf5844bb78965658cb818901a61a6',
        'feat: remove ResourceLiveData.setValue deprecation',
        '2018-11-07T07:43:33+01:00',
        'Synchronous updating of LiveData still has its own uses, provided it is called on UI thread and outside any general try/catch blocks.\n    Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        '017ffa996837a25851f695203320cc268a4fdb2e',
        'docs: add SectionRecyclerAdapter.getInnerPosition docs',
        '2018-11-07T07:42:04+01:00',
        'Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        'a1a2f8b747ac2f93afd03455da27d1008277050b',
        'docs: add experimental suppress explanation',
        '2018-11-07T07:30:23+01:00',
        'Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        '33a28b0fcf73dabf01395488ac1c4663ef06b162',
        'feat: add RxCoroutinesTimeMachine',
        '2018-11-05T14:20:25+01:00',
        'Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
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
        'This fixes bug where PreferenceProperty type is one of the Java\'s primitive types (int, long etc.) and its default value is null. Crash occures when trying to read non-null value from the preferences.',
),]

  const expected = fs.readFileSync('test/test-files/example-minor-release-with-ticket-changelog.txt').toString().trim()
  const actual = generateChangelog(commits, {
    gitCommitUrlPrefix: 'http://hydra/testProject/commit/'
  })

  expect(actual).toBe(expected)
})

test('show Jira tickets and links if Jira URL is not provided', () => {
  const commits =
    [      createFakeCommit(
      'abd0ae703769b889814fc1c896b55e96a1e9dbce',
      'fix: lock OnDemandProvider into mutex',
      '2018-11-20T08:29:38+01:00',
      'This prevents thread synchronization errors.\n    Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
    ),
      createFakeCommit(
        'fa5e0250f59bf5c8acdab7ae5e8070459a321a1d',
        'test(retrofit): add JUnit dependency',
        '2018-11-20T07:57:01+01:00',
        'Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        '962b3eb5cd9c6c9673ab2d818a560fe1a18765bb',
        '[HD-123] feat: use SupervisorJob on ViewModel',
        '2018-11-20T07:48:42+01:00',
        'This makes all jobs created by VM independent\n    Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        '340762ccc0ac26ab71c0579ac1f2a61211c0140c',
        'feat: make LiveData observing utils inline',
        '2018-11-07T07:48:01+01:00',
        'This fixes HA-578.\n\nSigned-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        '1ef779cdc35cf5844bb78965658cb818901a61a6',
        'feat: remove ResourceLiveData.setValue deprecation',
        '2018-11-07T07:43:33+01:00',
        'Synchronous updating of LiveData still has its own uses, provided it is called on UI thread and outside any general try/catch blocks.\n    Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        '017ffa996837a25851f695203320cc268a4fdb2e',
        'docs: add SectionRecyclerAdapter.getInnerPosition docs',
        '2018-11-07T07:42:04+01:00',
        'Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        'a1a2f8b747ac2f93afd03455da27d1008277050b',
        'docs: add experimental suppress explanation',
        '2018-11-07T07:30:23+01:00',
        'Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        '33a28b0fcf73dabf01395488ac1c4663ef06b162',
        'feat: add RxCoroutinesTimeMachine',
        '2018-11-05T14:20:25+01:00',
        'Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
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
        'This fixes bug where PreferenceProperty type is one of the Java\'s primitive types (int, long etc.) and its default value is null. Crash occures when trying to read non-null value from the preferences.',
),]

  const expected = fs.readFileSync('test/test-files/example-minor-release-with-ticket-and-jira-links-changelog.txt').toString().trim()
  const actual = generateChangelog(commits, {
    gitCommitUrlPrefix: 'http://hydra/testProject/commit/',
    jiraUrl: 'https://my-jira.atlassian.net'
  })

  expect(actual).toBe(expected)
})

test('Show unimportant commits if they have Jira tickets assigned', () => {
  const commits =
    [      createFakeCommit(
      'abd0ae703769b889814fc1c896b55e96a1e9dbce',
      'fix: lock OnDemandProvider into mutex',
      '2018-11-20T08:29:38+01:00',
      'This prevents thread synchronization errors.\n    Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
    ),
      createFakeCommit(
        'fa5e0250f59bf5c8acdab7ae5e8070459a321a1d',
        'test(retrofit): add JUnit dependency',
        '2018-11-20T07:57:01+01:00',
        'Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        '962b3eb5cd9c6c9673ab2d818a560fe1a18765bb',
        'feat: use SupervisorJob on ViewModel',
        '2018-11-20T07:48:42+01:00',
        'This makes all jobs created by VM independent\n    Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        '340762ccc0ac26ab71c0579ac1f2a61211c0140c',
        'feat: make LiveData observing utils inline',
        '2018-11-07T07:48:01+01:00',
        'Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        '1ef779cdc35cf5844bb78965658cb818901a61a6',
        'feat: remove ResourceLiveData.setValue deprecation',
        '2018-11-07T07:43:33+01:00',
        'Synchronous updating of LiveData still has its own uses, provided it is called on UI thread and outside any general try/catch blocks.\n    Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        '017ffa996837a25851f695203320cc268a4fdb2e',
        '[HD-123] docs: add SectionRecyclerAdapter.getInnerPosition docs',
        '2018-11-07T07:42:04+01:00',
        'Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        'a1a2f8b747ac2f93afd03455da27d1008277050b',
        'docs: add experimental suppress explanation',
        '2018-11-07T07:30:23+01:00',
        'Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        '33a28b0fcf73dabf01395488ac1c4663ef06b162',
        'feat: add RxCoroutinesTimeMachine',
        '2018-11-05T14:20:25+01:00',
        'Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
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
        'This fixes bug where PreferenceProperty type is one of the Java\'s primitive types (int, long etc.) and its default value is null. Crash occures when trying to read non-null value from the preferences.',
)]

  const expected = fs.readFileSync('test/test-files/example-minor-release-with-ticket-on-refactor-changelog.txt').toString().trim()
  const actual = generateChangelog(commits, {
    gitCommitUrlPrefix: 'http://hydra/testProject/commit/',
    jiraUrl: 'https://my-jira.atlassian.net'
  })

  expect(actual).toBe(expected)
})

test('generate changelog for a patch release', () => {
  const commits =
    [      createFakeCommit(
      'abd0ae703769b889814fc1c896b55e96a1e9dbce',
      'fix: lock OnDemandProvider into mutex',
      '2018-11-20T08:29:38+01:00',
      'This prevents thread synchronization errors.\n    Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
    ),
      createFakeCommit(
        'fa5e0250f59bf5c8acdab7ae5e8070459a321a1d',
        'test(retrofit): add JUnit dependency',
        '2018-11-20T07:57:01+01:00',
        'Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        '962b3eb5cd9c6c9673ab2d818a560fe1a18765bb',
        'fix: use SupervisorJob on ViewModel',
        '2018-11-20T07:48:42+01:00',
        'This makes all jobs created by VM independent\n    Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        '017ffa996837a25851f695203320cc268a4fdb2e',
        'docs: add SectionRecyclerAdapter.getInnerPosition docs',
        '2018-11-07T07:42:04+01:00',
        'Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
      ),
      createFakeCommit(
        'a1a2f8b747ac2f93afd03455da27d1008277050b',
        'docs: add experimental suppress explanation',
        '2018-11-07T07:30:23+01:00',
        'Signed-off-by: Matej Drobnič <matej.drobnic@inova.si>',
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
        'This fixes bug where PreferenceProperty type is one of the Java\'s primitive types (int, long etc.) and its default value is null. Crash occures when trying to read non-null value from the preferences.',
),
]

  const expected = fs.readFileSync('test/test-files/example-patch-release-changelog.txt').toString().trim()
  const actual = generateChangelog(commits, {
    gitCommitUrlPrefix: 'http://hydra/testProject/commit/',
    jiraUrl: 'https://my-jira.atlassian.net'
  })

  expect(actual).toBe(expected)
})
