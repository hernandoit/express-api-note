#!/bin/bash

# ID="610c829f547712afb250e08a" TOKEN="425b95943f2417998848e2bdc5268345" sh curl-scripts/notes/destroy.sh  

API="https://calm-taiga-11081.herokuapp.com"
URL_PATH="/notes"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request DELETE \
  --header "Authorization: Bearer ${TOKEN}"

echo
