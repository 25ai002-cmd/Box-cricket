import urllib.request
import urllib.parse
import re

query = 'site:unsplash.com "cricket bat"'
url = f"https://search.yahoo.com/search?p={urllib.parse.quote(query)}"

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8', errors='ignore')
        urls = re.findall(r'unsplash\.com/photos/([^"\'\s/>]+)', html)
        print("Found Unsplash IDs:")
        for u in set(urls):
            match = re.match(r'^([a-zA-Z0-9_-]+)', u)
            if match:
                print(match.group(1))
except Exception as e:
    print("Error:", e)
