#!/bin/bash

# ID="610c829f547712afb250e08a" TOKEN="425b95943f2417998848e2bdc5268345" TEXT="TRULY AMAZING" sh curl-scripts/notes/update.sh  

API="https://calm-taiga-11081.herokuapp.com"
URL_PATH="/notes"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
--header "Authorization: Bearer ${TOKEN}" \
--data '{
    "note": {
      "text": "'"${TEXT}"'"
    }
  }'

echo
