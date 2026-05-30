#!/bin/sh
set -e

MAVEN_VERSION="3.9.9"
MAVEN_BASE="apache-maven-${MAVEN_VERSION}"
DIST_DIR="${HOME}/.m2/wrapper/dists"
ARCHIVE="${DIST_DIR}/${MAVEN_BASE}-bin.tar.gz"
MAVEN_HOME="${DIST_DIR}/${MAVEN_BASE}"

if [ ! -x "${MAVEN_HOME}/bin/mvn" ]; then
  mkdir -p "${DIST_DIR}"
  URL="https://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/${MAVEN_BASE}-bin.tar.gz"
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL "${URL}" -o "${ARCHIVE}"
  elif command -v wget >/dev/null 2>&1; then
    wget -qO "${ARCHIVE}" "${URL}"
  else
    echo "curl or wget is required to download Maven"
    exit 1
  fi
  tar -xzf "${ARCHIVE}" -C "${DIST_DIR}"
fi

exec "${MAVEN_HOME}/bin/mvn" "$@"
