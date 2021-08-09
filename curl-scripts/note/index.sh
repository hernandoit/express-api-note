# TOKEN="e1fb23205fa51e4492aeb1062ebf78cd" sh curl-scripts/note/index.sh 

#!/bin/sh

API="http://localhost:4741"
URL_PATH="/notes"

curl "${API}${URL_PATH}" \
  --include \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}"

echo
