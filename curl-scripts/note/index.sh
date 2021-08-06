#!/bin/sh

# TOKEN="425b95943f2417998848e2bdc5268345" sh curl-scripts/notes/index.sh 

API="http://localhost:4741"
URL_PATH="/notes"

curl "${API}${URL_PATH}" \
  --include \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}"

echo
