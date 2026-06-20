import urllib.request
import re

url = "https://unsplash.com/photos/hAlGvDuQLf4"

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8', errors='ignore')
        print("HTML length:", len(html))
        # Find all images.unsplash.com/photo- URLs
        urls = re.findall(r'https://images\.unsplash\.com/photo-[^?s"\'><)]+', html)
        print("Found Unsplash CDN URLs:", len(urls))
        for u in set(urls):
            print(u)
except Exception as e:
    print("Error:", e)
