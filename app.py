from flask import Flask, render_template, jsonify
import requests
import random
import time
from functools import lru_cache

app = Flask(__name__)

# The Cat API base URL
CAT_API_BASE = "https://api.thecatapi.com/v1"

def get_random_cat_image():
    """Fetch a random cat image from The Cat API"""
    try:
        response = requests.get(f"{CAT_API_BASE}/images/search")
        if response.status_code == 200:
            data = response.json()
            if data:
                return data[0]['url']
    except:
        pass
    return None

# Removed pagination function - now loading all breeds at once

def get_cat_breeds_by_letter(letter):
    """Fetch cat breeds filtered by first letter"""
    try:
        response = requests.get(f"{CAT_API_BASE}/breeds", timeout=10)
        if response.status_code == 200:
            all_breeds = response.json()
            # Filter breeds by first letter
            filtered_breeds = [breed for breed in all_breeds if breed['name'].upper().startswith(letter.upper())]
            filtered_breeds.sort(key=lambda x: x['name'])
            
            print(f"Found {len(filtered_breeds)} breeds starting with '{letter}'")
            
            # Don't fetch images initially - we'll load them via JavaScript
            for breed in filtered_breeds:
                breed['image_url'] = ''  # Will be loaded later
            
            return filtered_breeds
    except requests.RequestException as e:
        print(f"Error fetching breeds: {e}")
    return []

# Image cache with timestamp for expiration
image_cache = {}
IMAGE_CACHE_DURATION = 1800  # 30 minutes

@lru_cache(maxsize=100)
def get_breed_image(breed_id):
    """Fetch a single breed image with caching"""
    try:
        img_response = requests.get(f"{CAT_API_BASE}/images/search?breed_ids={breed_id}&limit=1", timeout=2)
        if img_response.status_code == 200:
            img_data = img_response.json()
            if img_data and len(img_data) > 0:
                return img_data[0].get('url', '')
    except requests.RequestException:
        pass
    return ''

def get_cat_facts():
    """Get some interesting cat facts"""
    facts = [
        "Cats have five toes on their front paws, but only four toes on their back paws.",
        "A group of cats is called a 'clowder'.",
        "Cats can't taste sweetness.",
        "A cat's purr vibrates at a frequency that promotes bone healing.",
        "Cats sleep 12-16 hours per day.",
        "A cat's hearing is much more sensitive than humans and dogs.",
        "Cats have a third eyelid called a 'nictitating membrane'.",
        "Ancient Egyptians worshipped cats and considered them sacred.",
        "Cats have scent glands on their faces, paws, and flanks.",
        "A cat's nose print is unique, much like a human's fingerprint.",
        "The oldest known pet cat was found in a 9,500-year-old grave on the Mediterranean island of Cyprus.",
        "Cats spend about one-third of their waking hours grooming themselves.",
        "Adult cats only meow to communicate with humans, not other cats.",
        "The world’s richest cat, Blackie, inherited $12.5 million from his owner in 1988.",
        "Cats can rotate their ears 180 degrees using 32 different muscles.",
        "A cat can make over 100 different vocal sounds.",
        "House cats share 95.6% of their genetic makeup with tigers.",
        "The longest-living cat on record lived to be 38 years old.",
        "Cats can jump up to six times their body length in a single leap.",
        "When a cat rubs against you, it’s marking you as part of its territory.",
        "Male cats are more likely to be left-pawed, while female cats are more likely to be right-pawed.",
        "Cats have whiskers on the backs of their front legs to help them sense movement.",
        "A cat’s field of vision is about 200 degrees, compared to 180 degrees for humans.",
        "Some cats are allergic to humans — specifically to human dandruff.",
        "The first cat in space was a French cat named Félicette, launched in 1963.",
        "Cats can dream, just like humans do.",
        "Most cats dislike water because their fur doesn’t insulate well when wet.",
        "A cat’s brain is 90% similar to a human brain — more than a dog’s.",
        "Cats use their tails for balance and communication.",
        "The average cat runs at speeds up to 30 km/h (18 mph)."
    ]
    return random.sample(facts, 3)

@app.route('/')
def home():
    """Home page showing random cat image and facts"""
    cat_image = get_random_cat_image()
    cat_facts = get_cat_facts()
    return render_template('index.html', cat_image=cat_image, cat_facts=cat_facts)

# Cache for breeds data (expires after 1 hour)
breeds_cache = {'data': None, 'timestamp': 0}
CACHE_DURATION = 3600  # 1 hour in seconds

def get_all_cat_breeds():
    """Fetch all cat breeds at once with caching"""
    current_time = time.time()
    
    # Check if cache is valid
    if (breeds_cache['data'] is not None and 
        current_time - breeds_cache['timestamp'] < CACHE_DURATION):
        print("Using cached breeds data")
        return breeds_cache['data']
    
    try:
        print("Fetching all breeds from The Cat API")
        response = requests.get(f"{CAT_API_BASE}/breeds", timeout=5)
        print(f"API response status: {response.status_code}")
        
        if response.status_code == 200:
            all_breeds = response.json()
            print(f"Total breeds fetched from API: {len(all_breeds)}")
            
            # Sort breeds alphabetically 
            all_breeds.sort(key=lambda x: x['name'])
            
            # Don't fetch images initially - we'll load them via JavaScript
            for breed in all_breeds:
                breed['image_url'] = ''  # Will be loaded later
            
            breeds_data = {
                'breeds': all_breeds,
                'total_breeds': len(all_breeds)
            }
            
            # Update cache
            breeds_cache['data'] = breeds_data
            breeds_cache['timestamp'] = current_time
            
            return breeds_data
    except requests.RequestException as e:
        print(f"Error fetching breeds: {e}")
    
    print("API failed, returning empty result")
    return {'breeds': [], 'total_breeds': 0}

@app.route('/breeds')
def breeds():
    """Page showing all cat breeds"""
    print("Breeds route called!")
    try:
        breeds_data = get_all_cat_breeds()
        print(f"Loaded {len(breeds_data.get('breeds', []))} total breeds")
        
        return render_template('breeds.html', 
                             breeds=breeds_data['breeds'], 
                             total_breeds=breeds_data['total_breeds'])
    except Exception as e:
        print(f"Error in breeds route: {e}")
        return render_template('breeds.html', breeds=[], total_breeds=0)

@app.route('/api/breed-image/<breed_id>')
def api_breed_image(breed_id):
    """API endpoint to get breed image"""
    image_url = get_breed_image(breed_id)
    return jsonify({'image_url': image_url})

# Removed pagination endpoints - no longer needed



@app.route('/api/random-cat')
def api_random_cat():
    """API endpoint to get random cat image"""
    cat_image = get_random_cat_image()
    return jsonify({'image_url': cat_image})

@app.route('/api/cat-fact')
def api_cat_fact():
    """API endpoint to get a random cat fact"""
    facts = get_cat_facts()
    return jsonify({'fact': facts[0] if facts else 'Cats are amazing!'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)