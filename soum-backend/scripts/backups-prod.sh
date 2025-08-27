#!/bin/bash
# user local system defines
ADMINPATH=/home/backups/soum-prod/
MONGO_DBNAME=soum-prod
DAY=`/bin/date +%d`
MONTH=`/bin/date +%m`
YEAR=`/bin/date +%Y`
HOUR=`/bin/date +%H`
cd $ADMINPATH
mkdir -p $YEAR
cd $YEAR
mkdir -p $MONTH
cd $MONTH

echo "Creating MONGO DUMP: soum-prod_$DAY-$MONTH-$YEAR-$HOUR.tar"
mongodump --db $MONGO_DBNAME --authenticationDatabase=admin -u soum-admin-account -p soum2021  --archive=soum-prod_$DAY-$MONTH-$YEAR-$HOUR.tar
echo "file written to $ADMINPATH/$YEAR/$MONTH at $HOUR"

export AWS_ACCESS_KEY_ID=AKIA3JD4BPE37HJDEG6V
export AWS_SECRET_ACCESS_KEY=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
export AWS_REGION=ap-south-1
BACKUP_FILE="soum-prod_$DAY-$MONTH-$YEAR-$HOUR.tar"

scp -i ~/.ssh/soum_bastion $ADMINPATH/$YEAR/$MONTH/${BACKUP_FILE}  root@10.114.0.6:/tmp

ssh -i ~/.ssh/soum_bastion root@10.114.0.6 "export AWS_ACCESS_KEY_ID=AKIA3JD4BPE37HJDEG6V;export AWS_SECRET_ACCESS_KEY=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;export AWS_REGION=ap-south-1;aws s3 cp /tmp/${BACKUP_FILE} s3://soum-main-bucket-ap-south-1/ProductionSnapshot/soum-prod-latest.tar"
ssh -i ~/.ssh/soum_bastion root@10.114.0.6 "export AWS_ACCESS_KEY_ID=AKIA3JD4BPE37HJDEG6V;export AWS_SECRET_ACCESS_KEY=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;export AWS_REGION=ap-south-1;aws s3 cp /tmp/${BACKUP_FILE} s3://soum-main-bucket-ap-south-1/ProductionSnapshot/${BACKUP_FILE}"

ssh -i ~/.ssh/soum_bastion root@10.114.0.6 "rm /tmp/$BACKUP_FILE"