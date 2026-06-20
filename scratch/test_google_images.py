import urllib.request
import urllib.parse

query = "cricket bat product photo"
url = f"https://www.google.com/search?q={urllib.parse.quote(query)}&tbm=isch"

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        print("Status:", response.status)
        html = response.read().decode('latin-1')
        print("HTML length:", len(html))
        print("HTML prefix:", html[:1000])
except Exception as e:
    print("Error:", e)
