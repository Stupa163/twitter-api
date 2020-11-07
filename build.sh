mkdir files
if [ ! -f files/tweets.json ]; then
  echo '[]' > files/tweets.json
  echo 'file does not exist'
else
    echo 'file exist'
fi
