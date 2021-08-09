# TOKEN="3dc465c52d3ec2964d7686ff5d9a37be" sh curl-scripts/note/index.sh 

#!/bin/sh

API="http://localhost:4741"
URL_PATH="/notes"

curl "${API}${URL_PATH}" \
  --include \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}"

echo
