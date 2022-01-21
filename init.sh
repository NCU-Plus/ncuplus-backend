#!/usr/bin/env bash
echo "*** init the database users with bash file"
mysql -u root --password=$MARIADB_ROOT_PASSWORD \
--execute="CREATE DATABASE $COURSE_DATABASE;
GRANT ALL PRIVILEGES ON $COURSE_DATABASE.* TO '$MARIADB_USER'@'%';
FLUSH PRIVILEGES;"
echo "*** init compeleted"