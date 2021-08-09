# ID=" " TOKEN="aa6f0ae90014906e49270f06ada54b0d" sh curl-scripts/note/create.sh 

#!/bin/bash

API="http://localhost:4741"
URL_PATH="/notes"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request DELETE \
  --header "Authorization: Bearer ${TOKEN}"

echo
