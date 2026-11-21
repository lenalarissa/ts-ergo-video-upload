#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<EOF
Usage:
  scripts/buildVolumeImage.bash --domain <domain-name> --version <version> \
                     [--platforms "linux/amd64,linux/arm64"]
EOF
  exit 1
}

DOMAIN_NAME=""
VERSION=""
REGISTRY_NAME="registry.equeo.de"
ENVIRONMENT="production"
PLATFORMS="linux/amd64"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --domain)
      DOMAIN_NAME="$2"
      shift 2
      ;;
    --version)
      VERSION="$2"
      shift 2
      ;;
    --platforms)
      PLATFORMS="$2"
      shift 2
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      ;;
  esac
done

[[ -n "$DOMAIN_NAME" && -n "$VERSION" && -n "$REGISTRY_NAME" ]] || usage

# Basic validation to prevent malformed image tags or paths.
if [[ ! "$DOMAIN_NAME" =~ ^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$ ]]; then
  echo "Invalid domain name: $DOMAIN_NAME" >&2
  exit 1
fi

if [[ ! "$VERSION" =~ ^[A-Za-z0-9._-]+$ ]]; then
  echo "Invalid version: $VERSION" >&2
  exit 1
fi

IMAGE_TAG="${REGISTRY_NAME}/volumes/${DOMAIN_NAME}:${VERSION}"

owd=$(pwd)
scriptdir=`dirname "$BASH_SOURCE"`

cd "$scriptdir"
cd ..

rm -rf dist
npm run build

mv dist scripts/dist
cd "$scriptdir"

echo "Building: ${IMAGE_TAG}"
echo "Platforms: ${PLATFORMS}"

docker rmi -f ${IMAGE_TAG}

docker build --platform "${PLATFORMS}" --build-arg "DOMAIN_NAME=${DOMAIN_NAME}" --no-cache --force-rm --pull -t ${IMAGE_TAG} .
if [ $? -eq 0 ]; then
  docker push ${IMAGE_TAG}
fi

echo "Done: ${IMAGE_TAG}"

rm -rf dist

cd "$owd"
