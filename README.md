# moneyjinn

## Client
<a href="https://github.com/OlliL/moneyjinn-client/actions/workflows/main.yml"><img src="https://github.com/OlliL/moneyjinn-client/workflows/CodeQL/badge.svg" alt="build status"></a>

## Server
<a href="https://github.com/OlliL/moneyjinn-server/actions/workflows/codeql.yml"><img src="https://github.com/OlliL/moneyjinn-server/workflows/CodeQL/badge.svg" alt="build status"></a>

## Requirements

- NGINX
  - statically serves the Vue client from /mnt/www/nginx
  - forwards Backend requests to the server.
  - example configuration: https://github.com/OlliL/moneyjinn-server/blob/master/prod-nginx.conf
- MySQL 5.1 or higher (Backend)
- Java 17 (Backend)

## Installation

- build client
  - clone moneyjinn-client repository
  - make sure npm is installed
  - run build.sh which compiles the Vue client and places the result below /mnt/www/nginx
- build server
  - clone moneyjinn-server repository
  - make sure Java and Maven are installed
  - check https://github.com/OlliL/moneyjinn-server/blob/master/README on how to set up the database
  - run maven clean install

## Start Application

- start nginx
- start moneyjinn-server

## Configure Application

- open http://localhost/ in your favorite web browser (assuming you installed everything on your local machine)
- log in as admin (password admin)
- change the password
- create a new group
- create a new user with admin privileges, assign the user to the new group
- create capitalsources
- create contractpartner
- create postingt accounts (your user needs to have the right "admin")
