import urllib.request
import urllib.parse
import re
import os
import sys

dest_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'images', 'gear')
os.makedirs(dest_dir, exist_ok=True)

items = [
    { 'name': 'cricket_ball.jpg', 'query': 'red leather cricket ball png' },
    { 'name': 'cricket_bat.jpg', 'query': 'english willow cricket bat png' },
    { 'name': 'soccer_football.jpg', 'query': 'soccer ball size 5 png' },
    { 'name': 'badminton_racket.jpg', 'query': 'badminton racket png' },
    { 'name': 'shuttlecocks.jpg', 'query': 'shuttlecock png' },
    { 'name': 'tennis_racket.jpg', 'query': 'tennis racket png' },
    { 'name': 'tennis_balls.jpg', 'query': 'tennis ball png' },
    { 'name': 'table_tennis.jpg', 'query': 'ping pong paddle png' },
    { 'name': 'snooker_cue.jpg', 'query': 'snooker cue stick png' },
    { 'name': 'pool_cue.jpg', 'query': 'pool cue stick png' },
    { 'name': 'keyboard.jpg', 'query': 'gaming keyboard mouse png' },
    { 'name': 'headset.jpg', 'query': 'gaming headset png' },
    { 'name': 'basketball.jpg', 'query': 'basketball ball png' },
    { 'name': 'volleyball.jpg', 'query': 'volleyball ball png' },
    { 'name': 'golf_balls.jpg', 'query': 'golf ball png' },
    { 'name': 'hockey_stick.jpg', 'query': 'field hockey stick png' },
    { 'name': 'skates.jpg', 'query': 'inline skates png' }
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def search_and_download(item):
    query = item['query']
    filename = item['name']
    dest_path = os.path.join(dest_dir, filename)
    
    print(f"\nSearching for '{query}'...")
    url = f"https://www.bing.com/images/search?q={urllib.parse.quote(query)}"
    
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode('utf-8', errors='ignore')
            urls = re.findall(r'murl&quot;:&quot;(http[^&]+)&quot;', html)
            
            # Clean up URLs (remove backslashes or encoding leftovers)
            clean_urls = []
            for u in urls:
                u = u.replace('\\/', '/').replace('&amp;', '&')
                if not u.endswith('.gif') and not u.endswith('.svg'):
                    clean_urls.append(u)
            
            print(f"Found {len(clean_urls)} potential image URLs.")
            
            for index, img_url in enumerate(clean_urls[:8]):
                try:
                    print(f"  Attempting download {index + 1}: {img_url}")
                    img_req = urllib.request.Request(img_url, headers=headers)
                    with urllib.request.urlopen(img_req, timeout=8) as img_resp:
                        data = img_resp.read()
                        if len(data) > 1000: # Ensure it is a valid file, not a tiny placeholder/error
                            with open(dest_path, "wb") as f:
                                f.write(data)
                            print(f"  Successfully downloaded to {filename} ({len(data)} bytes)!")
                            return True
                except Exception as e:
                    print(f"  Failed download: {e}")
            
            # Fallback if no search URL downloaded successfully
            print(f"  Warning: Could not download any images from search results for '{query}'.")
            return False
            
    except Exception as e:
        print(f"Error searching for '{query}': {e}")
        return False

def main():
    print("Starting download of real sports equipment photos...")
    success_count = 0
    for item in items:
        if search_and_download(item):
            success_count += 1
        else:
            print(f"Failed to download image for '{item['name']}'")
            
    print(f"\nFinished! Successfully downloaded {success_count}/{len(items)} real sports equipment photos.")

if __name__ == '__main__':
    main()
