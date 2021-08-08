#!/bin/bash

# TOKEN="425b95943f2417998848e2bdc5268345" TEXT="NOTE" TITLE="AMAZING" sh curl-scripts/notes/create.sh 

API="https://calm-taiga-11081.herokuapp.com"
URL_PATH="/notes"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "note": {
      "text": "'"${TEXT}"'",
      "title": "'"${TITLE}"'"
    }
  }'

echo
