# ID="61105a3dfb258c515074fafa" TOKEN="3dc465c52d3ec2964d7686ff5d9a37be" sh curl-scripts/note/show.sh 

#!/bin/sh

API="http://localhost:4741"
URL_PATH="/notes"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}"

echo
