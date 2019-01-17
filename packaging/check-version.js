/* eslint-disable no-console, import/no-extraneous-dependencies */
const fs = require('fs');
const path = require('path');
const semver = require('semver');
const packageJSON = require('../package.json');

const currentReleaseMain = packageJSON.version;
let currentRelease = currentReleaseMain;

const branch = process.argv[2];
const lastTag = process.argv[3];

const lastReleaseMain = semver.coerce(lastTag);
const lastReleasePrerelease = semver.prerelease(lastTag);

if (!semver.valid(currentReleaseMain)) {
  throw new Error(`Release version (${currentReleaseMain}) is not valid. Please check package.json`);
}

if (branch === 'dev' || branch === 'master') {
  const track = branch === 'dev' ? 'alpha' : 'beta';
  // If the release version is the same and the last one was either an alpha or beta,
  // increment the prerelease version
  if (
    semver.eq(lastReleaseMain, currentReleaseMain)
    &&
    (
      (branch === 'dev' && lastReleasePrerelease[0] === 'alpha')
      ||
      (branch === 'master' && lastReleasePrerelease[0] === 'dev')
     )
  ) {
    currentRelease = semver.inc(currentReleaseMain, 'prerelease');
  } else if (semver.gt(currentReleaseMain, lastReleaseMain)) {
    // If the release version is newer than the last one
    // start a new prerelease track for the release
    currentRelease = `${currentRelease}-${track}.0`;
  } else {
    throw new Error('Release cannot be older than previous version');
  }

  packageJSON.version = currentRelease;

  fs.writeFileSync(path.resolve(__dirname, '..', 'package.json'), packageJSON);
}

console.log(currentRelease);