# TOKEN="ebcc59adf745a82efeb1c3884b99bb96" OLDPW="a" NEWPW="b" sh curl-scripts/auth/change-password.sh

#!/bin/bash

API="http://localhost:4741"
URL_PATH="/change-password"

curl "${API}${URL_PATH}/" \
  --include \
  --request PATCH \
  --header "Authorization: Bearer ${TOKEN}" \
  --header "Content-Type: application/json" \
  --data '{
    "passwords": {
      "old": "'"${OLDPW}"'",
      "new": "'"${NEWPW}"'"
    }
  }'

echo
