# TOKEN="e1fb23205fa51e4492aeb1062ebf78cd" TEXT="I really like sentences" TITLE="AMAZING SENTENCE" sh curl-scripts/note/create.sh 

#!/bin/bash

API="http://localhost:4741"
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
