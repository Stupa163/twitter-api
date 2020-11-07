mkdir files
if [ ! -f files/tweets.json ]; then
  echo '[]' > files/tweets.json
fi
