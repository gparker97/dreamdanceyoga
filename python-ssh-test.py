from fabric import Connection
import time
##import subprocess

AWS_SERVER="ec2-user@ec2-54-191-24-176.us-west-2.compute.amazonaws.com"
CONNECT_ARGS= {'key_filename': 'f:\Downld\Documents\Misc\AWS\Greg_KP1.pem'}
##CONNECT_ARGS['key_filename'] = "f:\Downld\Documents\Misc\AWS\Greg_KP1.pem"

##c = Connection(AWS_SERVER, connect_kwargs=CONNECT_ARGS)
##with settings(warn_only=True):
start = time.time()
print(f'starting time: {start}')
with Connection(AWS_SERVER, connect_kwargs=CONNECT_ARGS) as c:
    c.config.run = {'warn': True, 'hide': True}
    result1 = c.run('uname -a')
    result2 = c.run('ps -ef | grep ddy')
    result3 = c.run('ls')
    result4 = c.run('ls -ltr')
    result5 = c.run('kill -9 234234234')

end = time.time()
print(f'ending time: {end}')
print('total time: ' + str(end-start))
##result = Connection(host = AWS_SERVER, connect_kwargs=CONNECT_ARGS).run('uname -a')
print(f'\nRESULT 1 IS:\n{result1.stdout.strip()}')
print(f'RESULT 2 IS:\n{result2.stdout.strip()}')
print(f'RESULT 3 IS:\n{result3.stdout.strip()}')
print(f'RESULT 4 IS:\n{result4.stdout.strip()}')
if result5:
    print(f'RESULT 5 IS:\n{result5.stdout.strip()}')
else:
    print(f'RESULT 5 ERROR IS:\n{result5.stderr.strip()}')

print(f'RESULT 5 TOTAL IS:\n{result5}')

##print('\nSUBPROCESS TEST')
##AWS_KEY = 'f:\Downld\Documents\Misc\AWS\Greg_KP1.pem'
##cmd = 'ls -l'
##subp = subprocess.Popen(f"ssh -i {AWS_KEY} {AWS_SERVER} {cmd}", shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE).communicate()
##print(str(subp[0]))