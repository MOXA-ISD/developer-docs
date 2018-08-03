#!/bin/bash

RELEASE_TAG=$(yarn dotenv yarn release --dry-run | grep "next release version is" | sed 's/.* //')

if [ -n "$RELEASE_TAG" ]
then
  echo "Prepare to release version ${RELEASE_TAG}"
  yarn --cwd ./website run version ${RELEASE_TAG}
else
  echo "There is no next release version."
fi
