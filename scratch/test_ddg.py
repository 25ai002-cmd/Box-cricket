import urllib.request
import urllib.parse
import re

query = "cricket bat"
url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(query)}"

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8', errors='ignore')
        # Find image urls in the page (DuckDuckGo HTML search has <img> elements)
        # Search for img tags or external links
        print("HTML length:", len(html))
        img_tags = re.findall(r'<img[^>]+src="([^"]+)"', html)
        print("Found img tags:", len(img_tags))
        for img in img_tags[:5]:
            print("Img src:", img)
except Exception as e:
    print("Error:", e)
