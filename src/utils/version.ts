import semver from "semver";

export function getSemverSwiftVersion(swiftVersion: string) {
  return semver.coerce(swiftVersion)!.toString();
}
