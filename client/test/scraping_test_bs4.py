import re
import requests
from bs4 import BeautifulSoup

url = 'https://secure.acuityscheduling.com/products.php?action=viewOrder&id=46163983'
HEADERS = { 'User-Agent': 'Mozilla/5.0' }

## LOGGING IN
##POST_LOGIN_URL = 'https://secure.acuityscheduling.com/login.php?loggedout=1&ajax=0&popup=0'
POST_LOGIN_URL = 'https://secure.acuityscheduling.com/login.php'
locale = 'en-US'

auth_details = {
    'locale': locale,
    'username': 'info@dreamdanceyoga.com',
    'password': 'Dr3amsch3D!',
    'login': ''
}

##page = requests.get(url, headers = HEADERS)
##print(f'**** page BEFORE LOGIN ****\n\n{page.content}')

login_success = False
login_success_text = "Today's Appointments"
with requests.Session() as session:
    post = session.post(POST_LOGIN_URL, data = auth_details, headers = HEADERS)
    ##acuity_cookie = post.cookies
    print(f'\n****LOGIN RESULT****\nSTATUS: {post.status_code}')    
    if login_success_text in post.text:
        login_success = True
        print('LOGIN SUCCESSFUL')
    else:
        print ('LOGIN FAILED')
    if login_success:
        print(f'\nURL IS: {url}')
        r = session.get(url)

if login_success:
    ##print(f'\n\n**** page AFTER LOGIN ****\n\n{r.text}')

    soup = BeautifulSoup(r.text, "lxml")

    ##find_result_text = soup.find(text='subtotal')
    ##find_result = soup.find_all('div', {'class': ['col-sm-4', 'row-label']})
    
    find_result = soup.find_all('div')
    string_to_match = 'code'

    for res in find_result:
        ##print(f'**FOUND TEXT: {res.text.strip()}')
        if res.text.strip().startswith(string_to_match):
            strings = res.text.split()
            print(res.text.strip())
            print(f'STRINGS: {strings}')
            if len(strings) == 4 and strings[0] == string_to_match:
                print(f'CODE IS: {strings[1]}')
                break

    ##print(f'\n***FIND RESULT: {find_result}')

    text = soup.get_text()
    ##print(f'\n\nTEXT:{text}')

    search_term = 'subtotal'

    if search_term in text:
        print(f'\nFOUND {search_term}')
    else:
        print(f'\nNO {search_term}')
    
    print('***** WITHOUT SOUP *****')

    strings_to_match = ['-PRD', '-CLS']
    for line in r.text.splitlines():
        if any(x in line for x in strings_to_match):
            print(f'FOUND MATCH: ${line.strip()}')
            name_re = re.search(r'.*?>(.*)<', line)
            if name_re:
                name = name_re.group(1)
                print(f'NAME IS: {name}')

print ('all done!')