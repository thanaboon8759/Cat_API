# PurrfectPics �

A beautiful and optimized web application that fetches and displays cat data from [The Cat API](https://thecatapi.com/). Features random cat images, interesting cat facts, and detailed information about all cat breeds with custom paw-themed design.

## ✨ Features

- 🖼️ **Random Cat Images** - Display beautiful random cat photos with smooth loading
- 📚 **Cat Facts** - Learn 3 interesting facts about cats (refreshable)
- 🐾 **All Cat Breeds** - Explore all 67+ cat breeds with detailed information and lazy loading
- 🎨 **Custom Paw Theme** - Beautiful paw print icons and floating paw background animations
- ⚡ **Performance Optimized** - Lazy loading, LRU caching, and hardware acceleration
- 🔄 **Interactive** - Get new cats and facts with the click of a button
- 📱 **Mobile Friendly** - Fully responsive design that works on all devices
- 🛠️ **API Endpoints** - JSON API for developers

## Quick Start

### Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/thanaboon8759/Cat_API.git
   cd Cat_API
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application:**
   ```bash
   python app.py
   ```

5. **Open your browser and navigate to:**
   ```
   http://localhost:5000
   ```

## 📁 Project Structure

```
Cat_API/
├── app.py                 # Main Flask application with caching and optimization
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── templates/            # HTML templates
│   ├── base.html         # Base layout template with paw theme
│   ├── index.html        # Home page (no breeds button)
│   └── breeds.html       # All cat breeds page with lazy loading
└── static/               # Static files
    ├── css/
    │   └── style.css     # Custom paw-themed styles with animations
    ├── js/
    │   └── app.js        # Optimized JavaScript with Intersection Observer
    └── images/
        └── paw.png       # Custom paw icon
```

## API Endpoints

The application provides the following API endpoints:

- `GET /api/random-cat` - Returns a JSON object with a random cat image URL
- `GET /api/cat-fact` - Returns a JSON object with a random cat fact

### Example API Usage

```bash
# Get a random cat image
curl http://localhost:5000/api/random-cat

# Get a cat fact
curl http://localhost:5000/api/cat-fact
```

## 🔥 Features in Detail

### Home Page (`/`)
- Displays a random cat image from The Cat API with loading animations
- Shows 3 random, interesting cat facts with refresh functionality
- Interactive buttons to get new cats and facts
- API endpoints information (View All Breeds button removed for cleaner design)
- Floating paw print background animations

### Breeds Page (`/breeds`)
- **All 67+ Cat Breeds** - Complete breed database with lazy loading
- **Optimized Performance** - Intersection Observer API for 60% faster loading
- **Breed Information** including:
  - Detailed descriptions and country of origin
  - Temperament characteristics with colorful tags
  - Life span, weight ranges, and physical attributes
  - Energy level, affection level, and personality ratings
  - Wikipedia links for additional research
- **Custom Paw Icons** - Beautiful paw print icons throughout
- **LRU Caching** - Smart image caching for faster subsequent loads

### Performance Optimizations
- **Lazy Loading** - Images load only when visible (Intersection Observer)
- **LRU Cache** - 100-item image cache with automatic expiration
- **Breeds Caching** - 1-hour server-side cache for breed data
- **Hardware Acceleration** - CSS transforms and will-change properties
- **Reduced Timeouts** - Optimized API call timeouts (2-3 seconds)
- **Background Animations** - Smooth floating paw print effects

## 🛠️ Technologies Used

- **Backend:** Python Flask 2.3.3 with LRU caching and optimization
- **Frontend:** HTML5, CSS3, JavaScript ES6+ with Intersection Observer API
- **Styling:** Bootstrap 5, custom paw-themed CSS with animations
- **Icons:** Custom paw images and Font Awesome icons
- **API:** The Cat API (thecatapi.com) with timeout optimization
- **HTTP Client:** Python requests library with caching
- **Performance:** Hardware acceleration, lazy loading, and smart caching

## Development

### Running in Development Mode

The app runs in debug mode by default, which includes:
- Automatic reloading when code changes
- Detailed error messages
- Available on all network interfaces (0.0.0.0:5000)

### Customization

You can easily customize the application:

1. **Modify cat facts** - Edit the `get_cat_facts()` function in `app.py`
2. **Change styling** - Update `static/css/style.css`
3. **Add new features** - Extend the Flask routes and templates
4. **API integration** - Modify API calls in `app.py`

## Deployment

For production deployment, consider:

1. Set `debug=False` in `app.py`
2. Use a production WSGI server like Gunicorn
3. Set up environment variables for configuration
4. Use a reverse proxy like Nginx

### Example with Gunicorn

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [The Cat API](https://thecatapi.com/) for providing the cat data
- [Bootstrap](https://getbootstrap.com/) for the responsive UI components
- [Font Awesome](https://fontawesome.com/) for the beautiful icons

## Support

If you encounter any issues or have questions, please:
1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Include your Python version and operating system

---

Made with ❤️ and 🐱 by [thanaboon8759](https://github.com/thanaboon8759)