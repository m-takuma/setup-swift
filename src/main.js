const core = require('@actions/core');
const github = require('@actions/github');

const is_windows = process.platform === "win32";
const is_mac = process.platform === "darwin";
const is_linux = process.platform === "linux";

function run () {
  if (is_mac) {
    console.log('Setting up Swift on macOS');
    core.debug('Setting up Swift on macOS');
  } else if (is_linux) {
    console.log('Setting up Swift on Linux');
    core.debug('Setting up Swift on Linux');
  } else if (is_windows) {
    console.log('Setting up Swift on Windows');
    core.debug('Setting up Swift on Windows');
  }
}

run();