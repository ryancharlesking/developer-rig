#!/usr/bin/env bash
NAME=${1:-testing}

echo "Installing cert"
sudo apt-get update
sudo apt-get install libnss3-tools
sudo cp ${NAME} /usr/local/share/ca-certificates/
sudo update-ca-certificates
certutil -d sql:$HOME/.pki/nssdb -A -t P -n developer-rig -i ${NAME}
echo "You may need to restart chrome to get the certs to be installed"
