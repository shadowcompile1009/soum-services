# user local system defines
ADMINPATH=/home/backups/soum-dev/
MONGO_DBNAME=soum-dev
DAY=`/bin/date +%d`
MONTH=`/bin/date +%m`
YEAR=`/bin/date +%Y`
HOUR=`/bin/date +%H`
cd $ADMINPATH
mkdir -p $YEAR
cd $YEAR
mkdir -p $MONTH
cd $MONTH

echo "Creating MONGO DUMP: soum-dev_$DAY-$MONTH-$YEAR-$HOUR.tar"
mongodump --db $MONGO_DBNAME --authenticationDatabase=admin -u soum-admin-account -p soum2021  --archive="soum-dev_$DAY-$MONTH-$YEAR-$HOUR.tar" --gzip
echo "file written to $ADMINPATH/$YEAR/$MONTH at $HOUR"