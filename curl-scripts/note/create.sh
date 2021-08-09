# TOKEN="3dc465c52d3ec2964d7686ff5d9a37be" TEXT="I really like sentences" TITLE="AMAZING SENTENCE" sh curl-scripts/note/create.sh 

#!/bin/bash

API="http://localhost:4741"
URL_PATH="/notes"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "example": {
      "text": "'"${TEXT}"'",
      "title": "'"${TITLE}"'"
    }
  }'

echo
