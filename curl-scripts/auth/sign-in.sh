#!/bin/bash

# EMAIL="a@a.a" PASSWORD="a" sh curl-scripts/auth/sign-in.sh
API="https://calm-taiga-11081.herokuapp.com"
URL_PATH="/sign-in"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --data '{
    "credentials": {
      "email": "'"${EMAIL}"'",
      "password": "'"${PASSWORD}"'"
    }
  }'

echo
