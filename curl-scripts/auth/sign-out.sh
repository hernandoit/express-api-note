#!/bin/bash

# TOKEN="2649dbf03897fe8de4935b1f710065d9" sh curl-scripts/auth/sign-out.sh
API="https://calm-taiga-11081.herokuapp.com"
URL_PATH="/sign-out"

curl "${API}${URL_PATH}/" \
  --include \
  --request DELETE \
  --header "Authorization: Bearer ${TOKEN}"

echo
