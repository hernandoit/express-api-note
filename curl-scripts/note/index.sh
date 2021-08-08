#!/bin/sh

# TOKEN="425b95943f2417998848e2bdc5268345" sh curl-scripts/notes/index.sh 

API="https://calm-taiga-11081.herokuapp.com"
URL_PATH="/notes"

curl "${API}${URL_PATH}" \
  --include \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}"

echo
