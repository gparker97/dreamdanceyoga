#!/bin/bash

echo ""
echo "==== ACUITY REST CONTROLLER DEPLOY TO PROD ===="
echo ""
echo "Grabbing controller config..."

ACUITY_DIR=$PWD
ACUITY_FILE="acuityRestController.js"
KEY="/f/Downld/Documents/Misc/AWS/Greg_KP1.pem"

AWS_SERVER="ec2-user@ec2-54-191-24-176.us-west-2.compute.amazonaws.com"
AWS_SERVER_DIR="dreamdance-node/server"
AWS_BACKUP_DIR="old_scripts"
AWS_LOG_DIR="logs"
AWS_LOGFILE_PROD="acuityRestController.log"
AWS_LOGFILE_UAT="acuityRestController-UAT.log"

CURRENT_VER_PROD=`ssh -i "$KEY" $AWS_SERVER "ps -ef | grep 'node acuityRestController-v'" | grep -v grep | awk '{print $9}' | cut -d- -f2 | cut -dj -f1 | sed 's/.$//'`
CURRENT_VER_UAT=`ssh -i "$KEY" $AWS_SERVER "ps -ef | grep 'node acuityRestController-UAT-v'" | grep -v grep | awk '{print $9}' | cut -d- -f3 | cut -dj -f1 | sed 's/.$//'`
VER=`grep 'acuityRestControllerVersion =' "$ACUITY_DIR/$ACUITY_FILE" | cut -d= -f2 | sed 's/ //' | sed 's/;//' | sed "s/'//g"`

AWS_FILE_UAT_NEW="acuityRestController-UAT-v$VER-NEW.js"
AWS_FILE_UAT="acuityRestController-UAT-v$VER.js"
AWS_FILE_PROD="acuityRestController-v$VER.js"

## GET EXISTING FILE NAMES VIA SSH GREP
AWS_FILE_PROD_EXISTING=`ssh -i "$KEY" $AWS_SERVER "ps -ef | grep 'node acuityRestController-v'" | grep -v grep | awk '{print $9}'`
AWS_FILE_UAT_EXISTING=`ssh -i "$KEY" $AWS_SERVER "ps -ef | grep 'node acuityRestController-UAT-v'" | grep -v grep | awk '{print $9}'`

echo ""
echo "Current version PROD: $CURRENT_VER_PROD"
echo "Current version UAT: $CURRENT_VER_UAT"
echo ""
echo "NEW Version: $VER"
echo ""
echo -n "Push $ACUITY_FILE version $VER to UAT? (y/n) "
read PUSH_UAT_CONFIRM

## Push local DEV file to UAT
if [ "$PUSH_UAT_CONFIRM" = "y" ]
then
	echo ""
	echo "Pushing file: $ACUITY_DIR/$ACUITY_FILE"
	echo "To: $AWS_SERVER:$AWS_SERVER_DIR/$AWS_FILE_UAT_NEW"
	echo ""
	scp -i "$KEY" "$ACUITY_DIR/$ACUITY_FILE" $AWS_SERVER:$AWS_SERVER_DIR/$AWS_FILE_UAT_NEW
else
	echo "Skipping file push"
fi

## Restart UAT on AWS
echo ""
echo -n "Restart UAT controller $AWS_FILE_UAT? (y/n) "
read RESTART_UAT_CONFIRM

if [ "$RESTART_UAT_CONFIRM" = "y" ]
then
	## Stop existing UAT process, rename NEW, start new UAT process
	echo ""
	echo "Restarting UAT process $AWS_FILE_UAT_EXISTING..."
	ACUITY_UAT_PID=`ssh -i "$KEY" $AWS_SERVER "ps -ef | grep 'node acuityRestController-UAT-v'" | grep -v grep | awk '{print $2}'`
	echo "Acuity UAT process ID is: $ACUITY_UAT_PID"

	if [ ! -z "$ACUITY_UAT_PID" ]
	then
		echo ""
		echo "Stopping UAT process..."
		ssh -i "$KEY" $AWS_SERVER "kill -9 $ACUITY_UAT_PID"
		RESULT=$?
		if [ $RESULT -eq 0 ]
		then
			echo "UAT process $ACUITY_UAT_PID killed successfully"
		else
			echo "ERROR killing acuity UAT process"
		fi	

		## Backup existing UAT file to backup directory
		if [ ! -z "$AWS_FILE_UAT_EXISTING" ]
		then
			echo "Backing up existing UAT file $AWS_FILE_UAT_EXISTING to $AWS_SERVER_DIR/$AWS_BACKUP_DIR..."
			ssh -i "$KEY" $AWS_SERVER "mv $AWS_SERVER_DIR/$AWS_FILE_UAT_EXISTING $AWS_SERVER_DIR/$AWS_BACKUP_DIR"
		fi

		## RENAME UAT NEW FILE TO ACTUAL UAT FILE
		echo "Copying NEW UAT file $AWS_FILE_UAT_NEW to actual UAT file $AWS_FILE_UAT..."
		ssh -i "$KEY" $AWS_SERVER "mv $AWS_SERVER_DIR/$AWS_FILE_UAT_NEW $AWS_SERVER_DIR/$AWS_FILE_UAT"


		## START UAT REST CONTROLLER AND ASK TO TEST
		echo "Starting UAT node server $AWS_FILE_UAT..."
		ssh -i "$KEY" $AWS_SERVER "cd $AWS_SERVER_DIR; node $AWS_FILE_UAT 3444 >> $AWS_LOG_DIR/$AWS_LOGFILE_UAT 2>&1 &"
		RESULT_UAT=$?

		## IF successful
		echo ""
		echo "UAT node server started - test and deploy to prod when ready:"
		echo ""
		ssh -i "$KEY" $AWS_SERVER "ps -ef | grep 'node acuityRestController-UAT-v' | grep -v grep"
	fi
fi

echo ""
echo -n "Deploy $AWS_FILE_UAT to production and restart? (y/n) "
read PUSH_PROD_CONFIRM

if [ "$PUSH_PROD_CONFIRM" = "y" ]
then
	echo ""
	echo "Pushing file: $AWS_SERVER_DIR/$AWS_FILE_UAT"
	echo "To: $AWS_SERVER_DIR/$AWS_FILE_PROD"

	echo ""
	echo "Running PROD file is: $AWS_FILE_PROD_EXISTING"

	## Stop running PROD process
	echo ""
	echo "Getting PROD processes..."
	ACUITY_PROD_PID=`ssh -i "$KEY" $AWS_SERVER "ps -ef | grep 'node acuityRestController-v'" | grep -v grep | awk '{print $2}'`
	echo "Acuity PROD process ID is: $ACUITY_PROD_PID"

	if [ ! -z "$ACUITY_PROD_PID" ]
	then
		echo "Stopping PROD process..."
		ssh -i "$KEY" $AWS_SERVER "kill -9 $ACUITY_PROD_PID"
		RESULT=$?
		if [ $RESULT -eq 0 ]
		then
			echo "PROD process $ACUITY_PROD_PID killed successfully"
		else
			echo "ERROR killing PROD acuity process"
		fi	
	fi

	## Backup existing PROD files to backup directory
	if [ ! -z "$AWS_FILE_PROD_EXISTING" ]
	then
		echo "Backing up existing production file $AWS_FILE_PROD_EXISTING to $AWS_SERVER_DIR/$AWS_BACKUP_DIR..."
		ssh -i "$KEY" $AWS_SERVER "mv $AWS_SERVER_DIR/$AWS_FILE_PROD_EXISTING $AWS_SERVER_DIR/$AWS_BACKUP_DIR"
	fi

	## Copy UAT file to production
	echo "Copying UAT file $AWS_FILE_UAT to production $AWS_FILE_PROD..."
	ssh -i "$KEY" $AWS_SERVER "cp $AWS_SERVER_DIR/$AWS_FILE_UAT $AWS_SERVER_DIR/$AWS_FILE_PROD"


	## Start PROD node server
	echo "Starting PRODUCTION node server $AWS_FILE_PROD..."
	ssh -i "$KEY" $AWS_SERVER "cd $AWS_SERVER_DIR; node $AWS_FILE_PROD >> $AWS_LOG_DIR/$AWS_LOGFILE_PROD 2>&1 &"
	RESULT_PROD=$?

	if [ $RESULT_UAT -eq 0 ] && [ $RESULT_PROD -eq 0 ]
	then
		echo ""
		echo "Node server started SUCCESSFULLY!"
		echo ""
		echo "PROD:"
		ssh -i "$KEY" $AWS_SERVER "ps -ef | grep 'node acuityRestController-v' | grep -v grep"
		echo "All done!"
		echo ""
	else
		echo ""
		echo "ERROR STARTING NODE SERVER - PLEASE CHECK"
	fi
else
	echo ""
	echo "NOT pushing to production"
	echo ""
fi

exit 0
