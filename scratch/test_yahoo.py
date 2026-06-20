import urllib.request
import urllib.parse
import re

query = "cricket bat product photo"
url = f"https://images.search.yahoo.com/search/images?p={urllib.parse.quote(query)}"

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8', errors='ignore')
        print("HTML length:", len(html))
        # Yahoo images has img urls in the HTML data or in img tags
        # Search for imgurl or direct jpg/png urls
        urls = re.findall(r'"iurl":"([^"]+)"', html)
        print("Found Yahoo image URLs:", len(urls))
        for u in urls[:5]:
            print(u)
except Exception as e:
    print("Error:", e)
