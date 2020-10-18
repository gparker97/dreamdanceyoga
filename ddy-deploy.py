#!/usr/bin/python

import sys
import re
from shutil import copyfile
import pyperclip
from datetime import datetime
from fabric import Connection

## Set colors
class my_colors:
    PINK = '\033[95m'
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'    
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    ENDC = '\033[0m'

## Capture arguments
args = False
if len(sys.argv) > 1:
    args = True
    arg_1 = sys.argv[1]

########################################
## SET DETAILS OF DDY FILES TO DEPLOY ##
########################################

## Declare array to hold DDY code filenames and other data
ddy_file_data = []

## Set local location of files
client_home = 'F:\Google Drive - info@dreamdanceyoga\Dream Dance and Yoga\Documents\Website Code\\node\dreamdancenodeapp\express-acuity-secure\client\\'
server_home = 'F:\Google Drive - info@dreamdanceyoga\Dream Dance and Yoga\Documents\Website Code\\node\dreamdancenodeapp\express-acuity-secure\server\\'
subdir_js = 'js\\'
subdir_css = 'css\\'
backup_dir = 'old_scripts'

## DDY CLIENT FUNCTIONS JS
ddy_client_functions = {}
ddy_client_functions['name'] = "DDY Client Functions"
ddy_client_functions['copy'] = True
ddy_client_functions['static'] = True
ddy_client_functions['UAT_FILE'] = 'ddyApiClientFunctions-UAT.js'
ddy_client_functions['PROD_FILE'] = 'ddyApiClientFunctions-PROD.js'
ddy_client_functions['FULL_PATH_UAT'] = client_home + subdir_js + ddy_client_functions['UAT_FILE']
ddy_client_functions['FULL_PATH_PROD'] = client_home + subdir_js + ddy_client_functions['PROD_FILE']
ddy_file_data.append(ddy_client_functions)

## DDY CLIENT HTML+JS
ddy_client_html = {}
ddy_client_html['name'] = 'DDY Client HTML'
ddy_client_html['copy'] = True
ddy_client_html['static'] = False
ddy_client_html['UAT_FILE'] = 'ddyApiClientUAT.js'
ddy_client_html['PROD_FILE'] = 'ddyApiClientPROD.js'
ddy_client_html['FULL_PATH_UAT'] = client_home + subdir_js + ddy_client_html['UAT_FILE']
ddy_client_html['FULL_PATH_PROD'] = client_home + subdir_js + ddy_client_html['PROD_FILE']
ddy_file_data.append(ddy_client_html)

## DDY CHECK-IN POPUP
ddy_checkin_popup = {}
ddy_checkin_popup['name'] = 'DDY Check-in Popup'
ddy_checkin_popup['copy'] = True
ddy_checkin_popup['static'] = False
ddy_checkin_popup['UAT_FILE'] = 'checkinPopup-UAT.js'
ddy_checkin_popup['PROD_FILE'] = 'checkinPopup-PROD.js'
ddy_checkin_popup['FULL_PATH_UAT'] = client_home + subdir_js + ddy_checkin_popup['UAT_FILE']
ddy_checkin_popup['FULL_PATH_PROD'] = client_home + subdir_js + ddy_checkin_popup['PROD_FILE']
ddy_file_data.append(ddy_checkin_popup)

## DDY MYSTUDIO CSS
ddy_mystudio_CSS = {}
ddy_mystudio_CSS['name'] = 'DDY MyStudio CSS'
ddy_mystudio_CSS['copy'] = True
ddy_mystudio_CSS['static'] = True
ddy_mystudio_CSS['UAT_FILE'] = 'ddy-mystudio-UAT.css'
ddy_mystudio_CSS['PROD_FILE'] = 'ddy-mystudio-PROD.css'
ddy_mystudio_CSS['FULL_PATH_UAT'] = client_home + subdir_css + ddy_mystudio_CSS['UAT_FILE']
ddy_mystudio_CSS['FULL_PATH_PROD'] = client_home + subdir_css + ddy_mystudio_CSS['PROD_FILE']
ddy_mystudio_CSS_UAT = client_home + ddy_mystudio_CSS['UAT_FILE']
ddy_mystudio_CSS_PROD = client_home + ddy_mystudio_CSS['PROD_FILE']
ddy_file_data.append(ddy_mystudio_CSS)

## DDY REST CONTROLLER
ddy_rest_controller = {}
ddy_rest_controller['name'] = 'DDY Rest Controller'
ddy_rest_controller['copy'] = False
ddy_rest_controller['FILE_LOCAL'] = 'ddyRestController.js'
ddy_rest_controller['FULL_PATH_LOCAL'] = server_home + ddy_rest_controller['FILE_LOCAL']
ddy_rest_controller['NEW_VER'] = 'unknown'
ddy_rest_controller['AWS_SERVER'] = "ec2-user@api.dreamdanceyoga.com"
ddy_rest_controller['AWS_SERVER_DIR'] = "/home/ec2-user/dreamdance-node/server/"
ddy_rest_controller['AWS_LOG_DIR'] = "logs/"
ddy_rest_controller['AWS_PORT_UAT'] = 3444
ddy_rest_controller['AWS_LOGFILE_UAT'] = ddy_rest_controller['AWS_SERVER_DIR'] + ddy_rest_controller['AWS_LOG_DIR'] + 'ddyRestController-UAT.log'
ddy_rest_controller['AWS_LOGFILE_PROD'] = ddy_rest_controller['AWS_SERVER_DIR'] + ddy_rest_controller['AWS_LOG_DIR'] + 'ddyRestController.log'
ddy_rest_controller['AWS_BACKUP_DIR'] = ddy_rest_controller['AWS_SERVER_DIR'] + 'old_scripts/'
ddy_file_data.append(ddy_rest_controller)

## Function backup_existing_file
## 1) Takes existing file and appends timestamp
## 2) Copies file to backup path
def backup_existing_file(ddy_data, backup_filename, backup_file_full_path, ddy_cxn):
    BACKUP_SOURCE = backup_file_full_path

    ## Backup existing file
    if BACKUP_SOURCE != 'UNKNOWN':
        timestamp = datetime.now().strftime('%d%b%Y-%H:%M:%S')
        AWS_BACKUP_FILENAME = backup_filename + '-' + timestamp
        BACKUP_DEST = ddy_data['AWS_BACKUP_DIR'] + AWS_BACKUP_FILENAME
        
        print(f'\nBacking up file...\nExisting: {BACKUP_SOURCE}\nBackup: {BACKUP_DEST}')
        backup_file_cmd = f'mv {BACKUP_SOURCE} {BACKUP_DEST}'
        backup_file = ddy_cxn.run(backup_file_cmd)
        if not backup_file.failed:
            print('File backup completed successfully!')
            return True
        else:
            print(f'\n{my_colors.RED}ERROR: File backup failed.  Please make backup manually...\n{backup_file.stderr}{my_colors.ENDC}')
            val = input('Press enter when complete... ')
    else:
        print('\nFilename not known, skipping backup...')
        return False

## Function ddy_file_copy
## 1) Takes DDY file as argument
## 2) Copies file to PROD filename
## 3) Makes necessary substitutions for migration from UAT to PROD
## 4) Copies file contents to clipboard or prompts to upload to Squarespace as appropriate
def ddy_file_copy(ddy_file):
    deploy_success = True
    print('\nGenerating PROD file for {name}...'.format(**ddy_file))
    copy_file_success = False
    copy_prod_file = 'y'
    try:
        ## Take backup of PROD file
        timestamp = datetime.now().strftime('%d%b%Y-%H%M%S')
        backup_filename = ddy_file['PROD_FILE'] + '-BACKUP-' + timestamp
        backup_file = client_home + backup_dir + '\\' + backup_filename
        copyfile(ddy_file['FULL_PATH_PROD'], backup_file)
    except Exception as err:
        print(f'Error Details: {err}')
        copy_prod_file = input(f'{my_colors.RED}\nERROR: File backup failed!  Please check file location.  Continue anyway? (y/n) {my_colors.ENDC}')

    if copy_prod_file == 'y':
        ## Copy UAT file to PROD
        try:
            copyfile(ddy_file['FULL_PATH_UAT'], ddy_file['FULL_PATH_PROD'])
            print(f'File backup completed successfully: {backup_filename}')
        except Exception as err:
            deploy_success = False
            print(f'{my_colors.RED}ERROR: PROD file copy failed!  Please check file location.  Exiting...{my_colors.ENDC}')
            print(f'Error Details: {err}')
            exit()
    else:
        print('\nExiting...')
        exit()

    ## Read PROD file and make necessary replacements
    filename = ddy_file['FULL_PATH_PROD']
    try:
        with open(filename, 'r+', encoding='utf8') as f:
            text = f.read()
            
            ## Make necessary substitutions depending on file
            if ddy_file['name'] == 'DDY Client Functions':
                text = re.sub("const environment = 'UAT';", "const environment = 'PROD';", text)
                text = re.sub('END UAT FUNCTIONS', 'END PROD FUNCTIONS', text)
            elif ddy_file['name'] == 'DDY Client HTML':
                text = re.sub("const environment = 'UAT';", "const environment = 'PROD';", text)
                text = re.sub('https://sophiadance.squarespace.com/s/ddy-mystudio-UAT.css', 'https://sophiadance.squarespace.com/s/ddy-mystudio-PROD.css', text)
                text = re.sub('https://sophiadance.squarespace.com/s/ddyApiClientFunctions-UAT.js', 'https://sophiadance.squarespace.com/s/ddyApiClientFunctions-PROD.js', text)
                text = re.sub('<!-- END UAT -->', '<!-- END PROD -->', text)
            elif ddy_file['name'] == 'DDY Check-in Popup':                        
                text = re.sub('https://sophiadance.squarespace.com/s/ddy-mystudio-UAT.css', 'https://sophiadance.squarespace.com/s/ddy-mystudio-PROD.css', text)
                text = re.sub('https://sophiadance.squarespace.com/s/ddyApiClientFunctions-UAT.js', 'https://sophiadance.squarespace.com/s/ddyApiClientFunctions-PROD.js', text)
                text = re.sub('<!-- END POPUP WINDOW UAT -->', '<!-- END POPUP WINDOW PROD -->', text)
            else:
                print('No substitutions for {name}!'.format(**ddy_file))
            
            ## Write changes to file
            f.seek(0)
            f.write(text)
            f.truncate()

        print('PROD file created: {PROD_FILE}'.format(**ddy_file))
        copy_file_success = True
    except Exception as err:        
        print(f'{my_colors.RED}ERROR: Prod file generation failed for {filename}!{my_colors.ENDC}')
        print(f'Error Details: {err}')

    ## Copy contents of file to clipboard if required
    if copy_file_success and not ddy_file['static']:
        try:
            fo = open(ddy_file['FULL_PATH_PROD'], encoding="utf8").read()
            pyperclip.copy(fo)
            print('Contents of {PROD_FILE} copied to clipboard!'.format(**ddy_file))
            copy_file_success = True
        except Exception as err:
            print(f'{my_colors.RED}ERROR: Failed to copy file contents to clipboard{my_colors.ENDC}')
            print(f'Error Details: {err}')
    
    if copy_file_success and not ddy_file['static']:
        input(my_colors.GREEN + '\nProd file generation complete!\n\nCopy/paste {PROD_FILE} to Squarespace now!\nPress enter when complete...'.format(**ddy_file) + my_colors.ENDC)
    elif (copy_file_success):
        input(my_colors.GREEN + '\nProd file generation complete!\n\nUpload {PROD_FILE} to Squarespace Static Files page now!\nPress enter when complete...'.format(**ddy_file) + my_colors.ENDC)
    else:
        deploy_success = False
        print(f'\n{my_colors.RED}Prod file generation failed!  Please check errors.{my_colors.ENDC}')
    
    return deploy_success

## Function deploy_ddy_rest_controller
## 1) Determines version of updated local rest controller file
## 2) Once confirmed, copies file to AWS with temporary name
## 3) Kill UAT process and backup existing UAT file to backup dir
## 4) Put new UAT file in place and start UAT
## 5) Once UAT confirmed, do the same for PROD 
def deploy_ddy_rest_controller(ddy_file):
    deploy_success = True

    ## Set server vars
    AWS_SERVER = ddy_file['AWS_SERVER']
    AWS_SERVER_DIR = ddy_file['AWS_SERVER_DIR']
    AWS_TEMP_DIR="temp/"
    
    print('\n{name}: Grabbing controller configuration from AWS ...'.format(**ddy_file), flush=True)
    
    ## Get new version from local file to be uploaded to AWS
    filename = ddy_file['FULL_PATH_LOCAL']
    try:
        with open(filename, 'r', encoding='utf8') as f:
            for line in f:
                if 'ddyRestControllerVersion =' in line:                            
                    new_ver_re = re.search(r"ddyRestControllerVersion = '([0-9]\.[0-9]\.[0-9])", line)
                    NEW_VER = new_ver_re.group(1)
                    ddy_file['NEW_VER'] = NEW_VER
                    break
    
    except Exception as err:
        print(f'\n{my_colors.RED}ERROR: Could not determine new version from local file - please check!  Exiting...\n{err}{my_colors.ENDC}')
        exit()

    ## Connect to AWS server and grab basic info            
    CONNECT_ARGS = {'key_filename': 'f:\Downld\Documents\Misc\AWS\Greg_KP1.pem'}

    with Connection(AWS_SERVER, connect_kwargs=CONNECT_ARGS) as c:
        c.config.run = {'warn': True, 'hide': True}
        ddy_processes_cmd = 'ps -ef | grep ddyRestController'
        ddy_processes = c.run(ddy_processes_cmd)
    
    ## Parse DDY process output to store required data
    if not ddy_processes.failed:
        ddy_proc_running = False        

        ## Set proc var defaults
        UAT_FILENAME = 'UNKNOWN'
        UAT_VER = 'UNKNOWN'
        UAT_PID = 'UNKNOWN'
        PROD_FILENAME = 'UNKNOWN'
        PROD_VER = 'UNKNOWN'
        PROD_PID = 'UNKNOWN'

        for line in ddy_processes.stdout.splitlines():
            if 'node ddyRestController' in line:
                ddy_proc_running = True
                ddy_filename_re = re.compile(r'node (ddyRestController.*?js)')
                ddy_ver_re = re.compile(r'v([0-9]\.[0-9]\.[0-9])')
                if 'UAT' in line:
                    ## UAT filename                    
                    uat_filename_re = re.search(ddy_filename_re, line)                    
                    if uat_filename_re:
                        UAT_FILENAME = uat_filename_re.group(1).strip()
                    
                    ## UAT version                    
                    uat_ver_re = re.search(ddy_ver_re, line)                    
                    if uat_ver_re:
                        UAT_VER = uat_ver_re.group(1).strip()

                    ## UAT PID                    
                    uat_proc_fields = line.split()                    
                    if len(uat_proc_fields) > 1:
                        UAT_PID = uat_proc_fields[1]
                        
                else:
                    ## PROD filename
                    prod_filename_re = re.search(ddy_filename_re, line)                    
                    if prod_filename_re:
                        PROD_FILENAME = prod_filename_re.group(1).strip()
                    
                    ## PROD version
                    prod_ver_re = re.search(ddy_ver_re, line)                    
                    if prod_ver_re:
                        PROD_VER = prod_ver_re.group(1).strip()

                    ## PROD PID
                    prod_proc_fields = line.split()                    
                    if len(prod_proc_fields) > 1:
                        PROD_PID = prod_proc_fields[1]

        if ddy_proc_running:
            print(f'\nUAT FILE: {UAT_FILENAME}')
            print(f'PROD FILE: {PROD_FILENAME}')
            print(f'UAT PID: {UAT_PID}')
            print(f'PROD PID: {PROD_PID}')
            print(f'Current version UAT: {UAT_VER}')
            print(f'Current version PROD: {PROD_VER}')
            print(f'\nNEW version: {NEW_VER}')
        else:
            val = input(f'\n{my_colors.RED}ERROR: No DDY processes are running!  Continue? (y/n) {my_colors.ENDC}')
            if val != 'y':
                print('\nExiting...')
                exit()
        
        uat_deployed = False
        val = input('\nPush {name} version {NEW_VER} to UAT? (y/n) '.format(**ddy_file))
        if val == 'y':
            ## Set directory locations and filenames
            ddy_rest_controller['FILE_AWS_UAT_NEW'] = f'ddyRestController-UAT-v{NEW_VER}-NEW.js'
            ddy_rest_controller['FILE_AWS_UAT'] = f'ddyRestController-UAT-v{NEW_VER}.js'
            ddy_rest_controller['FILE_AWS_PROD'] = f'ddyRestController-v{NEW_VER}.js'
            ddy_rest_controller['FULL_PATH_AWS_UAT_EXISTING'] = ddy_rest_controller['AWS_SERVER_DIR'] + UAT_FILENAME
            ddy_rest_controller['FULL_PATH_AWS_PROD_EXISTING'] = ddy_rest_controller['AWS_SERVER_DIR'] + PROD_FILENAME
            ddy_rest_controller['FULL_PATH_AWS_UAT_NEW'] = ddy_rest_controller['AWS_SERVER_DIR'] + ddy_rest_controller['FILE_AWS_UAT_NEW']
            ddy_rest_controller['FULL_PATH_AWS_UAT'] = ddy_rest_controller['AWS_SERVER_DIR'] + ddy_rest_controller['FILE_AWS_UAT']
            ddy_rest_controller['FULL_PATH_AWS_PROD'] = ddy_rest_controller['AWS_SERVER_DIR'] + ddy_rest_controller['FILE_AWS_PROD']

            ## Copy DDY REST CONTROLLER to TEMP UAT
            print('\nPushing LOCAL file: {FULL_PATH_LOCAL}'.format(**ddy_file), flush=True)
            print('To: {AWS_SERVER}:{FULL_PATH_AWS_UAT_NEW}'.format(**ddy_file), flush=True)

            with Connection(AWS_SERVER, connect_kwargs=CONNECT_ARGS) as c:
                c.config.run = {'warn': True, 'hide': True}
                try:
                    uat_copy_result = c.put(ddy_file['FULL_PATH_LOCAL'], remote=ddy_file['FULL_PATH_AWS_UAT_NEW'])
                except Exception as e:
                    deploy_success = False
                    uat_copy_result = False
                    print(f'{my_colors.RED}\nERROR: File copy failed: {e}{my_colors.ENDC}')
            
            ## If file copy is successful, backup and replace UAT file and restart process
            if uat_copy_result:
                print(f'\nFile Copy Successful!\nLocal: {uat_copy_result.local}\nRemote: {uat_copy_result.remote}!')
                
                ## Stop existing UAT process and backup existing UAT file to backup directory
                print('\nStopping UAT process...', flush=True)
                with Connection(AWS_SERVER, connect_kwargs=CONNECT_ARGS) as c:
                    c.config.run = {'warn': True, 'hide': True}
                    ## Stop UAT process
                    if UAT_PID != 'UNKNOWN':                                
                        kill_existing_uat = c.run(f'kill -9 {UAT_PID}')
                        if not kill_existing_uat.failed:
                            print(f'UAT process {UAT_PID} killed successfully')
                        else:
                            val = input(f'{my_colors.RED}\nERROR: Could not kill UAT process: {kill_existing_uat.stderr}Continue? (y/n) {my_colors.ENDC}')
                            if val != 'y':
                                print('\nExiting...')
                                exit()
                    else:
                        print(f'{my_colors.RED}DDY API UAT process not running, skipping process stop...{my_colors.ENDC}')
                    
                    ## Backup existing UAT file
                    ##backup_existing_file(ddy_file, ddy_file['FILE_AWS_UAT'], ddy_file['FULL_PATH_AWS_UAT'], c)
                    if UAT_FILENAME != 'UNKNOWN':
                        backup_existing_file(ddy_file, UAT_FILENAME, ddy_file['FULL_PATH_AWS_UAT_EXISTING'], c)
                    else:
                        print(f'{my_colors.RED}DDY UAT process not found, skipping UAT file backup...{my_colors.ENDC}')

                    ## Rename UAT file
                    print('\nPutting new UAT file in place...', flush=True)
                    rename_uat_file = c.run('mv {FULL_PATH_AWS_UAT_NEW} {FULL_PATH_AWS_UAT}'.format(**ddy_file))
                    if not rename_uat_file.failed:
                        print('New UAT file in place.')
                    else:
                        print(f'\n{my_colors.RED}ERROR: UAT file rename failed: {rename_uat_file.stderr}{my_colors.ENDC}')
                    
                    ## Start updated UAT process, prompt user to test
                    print('\nStarting UAT node server {FILE_AWS_UAT}...'.format(**ddy_file), flush=True)                            
                    node_uat_start_cmd = 'cd {AWS_SERVER_DIR}; node {FILE_AWS_UAT} {AWS_PORT_UAT} >> {AWS_LOGFILE_UAT} 2>&1 &'.format(**ddy_file)
                    print(f'Running cmd: {node_uat_start_cmd}')
                    start_uat_proc = c.run(node_uat_start_cmd)

                    ## Confirm UAT process started successfully
                    node_uat_confirm_cmd = "ps -ef | grep 'node ddyRestController-UAT-v' | grep -v grep"
                    start_uat_proc_confirm = c.run(node_uat_confirm_cmd)
                    if not start_uat_proc_confirm.failed and 'ddyRestController-UAT' in start_uat_proc_confirm.stdout:
                        uat_deployed = True
                        print(f'New UAT process: {my_colors.BLUE}{start_uat_proc_confirm.stdout}{my_colors.ENDC}')
                        print(f'{my_colors.GREEN}UAT node server started!  Test and deploy to prod when ready.{my_colors.ENDC}')
                    else:
                        deploy_success = False
                        print(f'\n{my_colors.RED}ERROR: UAT node server failed to start!\nStart UAT process error: {start_uat_proc.stderr}{my_colors.ENDC}')
        else:
            deploy_success = False
            print('NOT pushing rest controller to UAT!')
                        
        if uat_deployed:
            ## Deploy to production
            val = input('\nPush {name} version {NEW_VER} to production and restart? (y/n) '.format(**ddy_file))
            if val == 'y':
                ## Stop existing PROD process
                print('\nStopping PROD process...', flush=True)
                if PROD_PID != 'UNKNOWN':
                    kill_existing_prod = c.run(f'kill -9 {PROD_PID}')
                    if not kill_existing_prod.failed:
                        print(f'PROD process {PROD_PID} killed successfully')
                    else:
                        val = input(f'{my_colors.RED}\nERROR: Could not kill PROD process: {kill_existing_prod.stderr}Continue? (y/n) {my_colors.ENDC}')
                        if val != 'y':
                            print('\nExiting...')
                            exit()
                else:
                    print('DDY API PROD process not running, skipping process stop...')

                ## Backup existing PROD file                
                backup_existing_file(ddy_file, PROD_FILENAME, ddy_file['FULL_PATH_AWS_PROD_EXISTING'], c)

                ## Copy PROD file to production
                print('\nCopying PROD file to production...\nSource: {FULL_PATH_AWS_UAT}\nDestination: {FULL_PATH_AWS_PROD}'.format(**ddy_file), flush=True)
                
                ## Copy UAT file to PROD and sed to update UAT vars to PROD
                copy_uat_to_prod_cmd = "sed 's/const debug = true;/const debug = false; \/\/ UPDATED BY DEPLOY SCRIPT/' < {FULL_PATH_AWS_UAT} > {FULL_PATH_AWS_PROD}".format(**ddy_file)
                copy_uat_to_prod = c.run(copy_uat_to_prod_cmd)
                if not copy_uat_to_prod.failed:
                    print('New PROD file in place.')

                    ## Start PROD server
                    print('\nStarting PROD node server {FILE_AWS_PROD}...'.format(**ddy_file), flush=True)                            
                    node_prod_start_cmd = 'cd {AWS_SERVER_DIR}; node {FILE_AWS_PROD} >> {AWS_LOGFILE_PROD} 2>&1 &'.format(**ddy_file)
                    print(f'Running cmd: {node_prod_start_cmd}')
                    start_prod_proc = c.run(node_prod_start_cmd)
                    
                    ## Confirm PROD process started successfully
                    node_prod_confirm_cmd = "ps -ef | grep 'node ddyRestController-v' | grep -v grep"
                    start_prod_proc_confirm = c.run(node_prod_confirm_cmd)
                    if not start_prod_proc_confirm.failed and 'ddyRestController-' in start_prod_proc_confirm.stdout:
                        print(f'New PROD process: {my_colors.BLUE}{start_prod_proc_confirm.stdout}{my_colors.ENDC}')
                        print(f'{my_colors.GREEN}PROD node server started successfully!{my_colors.ENDC}')
                    else:
                        deploy_success = False
                        print(f'\n{my_colors.RED}ERROR: PROD node server failed to start!\nStart PROD process error: {start_prod_proc.stderr}{my_colors.ENDC}')
                else:
                    deploy_success = False
                    print(f'\n{my_colors.RED}ERROR: PROD file copy failed: {copy_uat_to_prod.stderr}{my_colors.ENDC}')
            else:
                deploy_success = False
                print('NOT pushing to production')
    else:
        deploy_success = False
        print(f'{my_colors.RED}ERROR: Could not retrieve DDY processes: {ddy_processes.stderr}{my_colors.ENDC}')
    
    return deploy_success

##########
## MAIN ##
##########

print(f'{my_colors.RED}\n==== DREAM DANCE AND YOGA MYSTUDIO DEPLOY TO PROD ===={my_colors.ENDC}')

deploy_success = True
deployment_attempted = False

if args and arg_1 == 'ddyrest':
    deployment_attempted = True
    ddy_file = ddy_rest_controller
    deploy_success = deploy_ddy_rest_controller(ddy_file)
else:
    ## Loop through array of DDY mystudio files to deploy to production
    for ddy_file in ddy_file_data:
        val = input('\nDeploy {name} (y/n)? '.format(**ddy_file))
        if val == 'y':
            deployment_attempted = True
            if ddy_file['copy']:
                ## Generate local PROD file, and prepare for copy to Squarespace (either copy/paste or deploy to Static Files)
                deploy_success = ddy_file_copy(ddy_file)
            elif ddy_file['name'] == 'DDY Rest Controller':
                ## Deploy DDY Rest Controller to AWS - UAT and PROD
                deploy_success = deploy_ddy_rest_controller(ddy_file)
            else:
                print('Deployment for {name} not implemented yet!'.format(**ddy_file))
        else:
            print('Skipping {name}'.format(**ddy_file))

if deployment_attempted:
    if deploy_success:
        print(f'{my_colors.GREEN}\nProduction deployment complete!  Please test to check functionality.  Exiting...{my_colors.ENDC}')
    else:
        print(f'{my_colors.RED}\nDeployment incomplete or errors encountered during deployment!  Please check and fix.  Exiting...{my_colors.ENDC}')
else:
    print(f'{my_colors.RED}\nNo deployments done!  Exiting...{my_colors.ENDC}')