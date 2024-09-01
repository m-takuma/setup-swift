import * as core from '@actions/core';
import { setup_swift_on_mac } from './setup_swift_on_mac';
import { setup_swift_on_linux } from './setup_swift_on_linux';
import {
  IS_WINDOWS,
  IS_MAC,
  IS_LINUX,
} from './utils/os';

function run () {
  if (IS_MAC) {
    console.log('Setting up Swift on macOS');
    core.debug('Setting up Swift on macOS');
    setup_swift_on_mac('5.10.1');
  } else if (IS_LINUX) {
    console.log('Setting up Swift on Linux');
    core.debug('Setting up Swift on Linux');
    setup_swift_on_linux('5.10.1');
  } else if (IS_WINDOWS) {
    console.log('Setting up Swift on Windows');
    core.debug('Setting up Swift on Windows');
    core.setFailed('Windows is not supported');
  } else {
    console.log('Unsupported OS');
    core.debug('Unsupported OS');
    core.setFailed('Unsupported OS');
  }
}


run();