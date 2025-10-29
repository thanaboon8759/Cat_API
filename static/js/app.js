// JavaScript functionality for Cat API Web App

// Function to get a new random cat image
async function getNewCat() {
    const button = document.querySelector('button[onclick="getNewCat()"]');
    const catImage = document.getElementById('catImage');
    
    if (!button || !catImage) return;
    
    // Show loading state
    const originalText = button.innerHTML;
    button.innerHTML = '<div class="spinner"></div>Loading...';
    button.disabled = true;
    
    try {
        const response = await fetch('/api/random-cat');
        const data = await response.json();
        
        if (data.image_url) {
            // Fade out current image
            catImage.style.opacity = '0.3';
            
            // Load new image
            const newImg = new Image();
            newImg.onload = function() {
                catImage.src = data.image_url;
                catImage.style.opacity = '1';
                catImage.style.transform = 'scale(1)';
            };
            newImg.src = data.image_url;
        }
    } catch (error) {
        console.error('Error fetching new cat:', error);
        showNotification('Failed to load new cat image. Please try again!', 'error');
    } finally {
        // Restore button
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 1000);
    }
}

// Function to get a new cat fact
async function getNewFact() {
    const button = document.querySelector('button[onclick="getNewFact()"]');
    
    if (!button) return;
    
    // Show loading state
    const originalText = button.innerHTML;
    button.innerHTML = '<div class="spinner"></div>Loading...';
    button.disabled = true;
    
    try {
        const response = await fetch('/api/cat-fact');
        const data = await response.json();
        
        if (data.fact) {
            // Find the facts container and update with new fact
            const factsContainer = button.closest('.card-body');
            const alertDivs = factsContainer.querySelectorAll('.alert-info');
            
            if (alertDivs.length > 0) {
                // Replace the first fact with the new one
                alertDivs[0].innerHTML = `<i class="fas fa-info-circle"></i> ${data.fact}`;
                
                // Add a little animation
                alertDivs[0].style.animation = 'fadeIn 0.5s ease-out';
            }
        }
    } catch (error) {
        console.error('Error fetching cat fact:', error);
        showNotification('Failed to load new cat fact. Please try again!', 'error');
    } finally {
        // Restore button
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 1000);
    }
}

// Function to show notifications
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : 'info'} notification`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1050;
        min-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;
    notification.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
        ${message}
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Helper function to create breed card HTML
function createBreedCard(breed) {
    const col = document.createElement('div');
    col.className = 'col-lg-6 col-xl-4 mb-4';
    
    col.innerHTML = `
        <div class="card h-100 shadow-sm breed-card loading-card" data-breed-id="${breed.id}">
            <div class="card-header bg-light">
                <h5 class="card-title mb-0">${breed.name}</h5>
                ${breed.origin ? `<small class="text-muted"><i class="fas fa-globe"></i> Origin: ${breed.origin}</small>` : ''}
            </div>
            <div class="card-body">
                <div class="breed-image-container">
                    <div class="breed-image-skeleton skeleton"></div>
                </div>
                ${breed.description ? `<p class="card-text">${breed.description.length > 150 ? breed.description.substring(0, 150) + '...' : breed.description}</p>` : ''}
                
                <div class="breed-info">
                    ${breed.temperament ? `
                        <p><strong><span class="paw-icon"></span> Temperament:</strong><br>
                        ${breed.temperament.split(',').slice(0, 3).map(temp => 
                            `<span class="badge bg-secondary me-1">${temp.trim()}</span>`
                        ).join('')}
                        </p>
                    ` : ''}
                    
                    ${breed.life_span ? `<p><strong><i class="fas fa-clock"></i> Life Span:</strong> ${breed.life_span} years</p>` : ''}
                    
                    ${breed.weight && breed.weight.metric ? `<p><strong><i class="fas fa-weight"></i> Weight:</strong> ${breed.weight.metric} kg</p>` : ''}
                </div>
                
                <div class="breed-ratings mt-3">
                    ${breed.energy_level ? `
                        <div class="mb-1">
                            <small><strong>Energy Level:</strong></small>
                            <div class="rating-stars">
                                ${Array.from({length: 5}, (_, i) => 
                                    i < breed.energy_level ? '<i class="fas fa-star text-warning"></i>' : '<i class="far fa-star text-muted"></i>'
                                ).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${breed.affection_level ? `
                        <div class="mb-1">
                            <small><strong>Affection Level:</strong></small>
                            <div class="rating-stars">
                                ${Array.from({length: 5}, (_, i) => 
                                    i < breed.affection_level ? '<span class="paw-icon" style="filter: hue-rotate(0deg) saturate(1.5) brightness(1.2);"></span>' : '<span class="paw-icon" style="opacity: 0.3;"></span>'
                                ).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
            ${breed.wikipedia_url ? `
                <div class="card-footer">
                    <a href="${breed.wikipedia_url}" target="_blank" class="btn btn-outline-primary btn-sm">
                        <i class="fab fa-wikipedia-w"></i> Learn More
                    </a>
                </div>
            ` : ''}
        </div>
    `;
    
    return col;
}

// Helper function to load a single breed image
async function loadSingleBreedImage(breedId) {
    const breedCard = document.querySelector(`[data-breed-id="${breedId}"]`);
    if (!breedCard) return;
    
    const imageContainer = breedCard.querySelector('.breed-image-container');
    const skeleton = imageContainer ? imageContainer.querySelector('.breed-image-skeleton') : null;
    
    if (!imageContainer) return;
    
    try {
        const response = await fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}&limit=1`);
        const data = await response.json();
        
        if (data && data.length > 0) {
            const img = document.createElement('img');
            img.className = 'card-img-top breed-image';
            img.alt = 'Cat breed image';
            img.src = data[0].url;
            img.style.cssText = 'height: 250px; object-fit: cover;';
            
            img.onload = function() {
                if (skeleton) {
                    skeleton.style.display = 'none';
                }
                imageContainer.appendChild(img);
                breedCard.classList.remove('loading-card');
            };
            
            img.onerror = function() {
                if (skeleton) {
                    skeleton.innerHTML = '<i class="fas fa-image text-muted"></i><div class="mt-2 text-muted">Image unavailable</div>';
                    skeleton.classList.remove('skeleton');
                }
            };
        } else {
            if (skeleton) {
                skeleton.innerHTML = '<i class="fas fa-image text-muted"></i><div class="mt-2 text-muted">No image available</div>';
                skeleton.classList.remove('skeleton');
            }
        }
    } catch (error) {
        console.error(`Error loading image for breed ${breedId}:`, error);
        if (skeleton) {
            skeleton.innerHTML = '<i class="fas fa-image text-muted"></i><div class="mt-2 text-muted">Image unavailable</div>';
            skeleton.classList.remove('skeleton');
        }
    }
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .notification {
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        border: none;
    }
    
    .notification .btn-close {
        position: absolute;
        top: 8px;
        right: 8px;
    }
`;
document.head.appendChild(style);

// Function to load breed images lazily
// Optimized lazy loading function for breed images
async function loadBreedImages() {
    const breedCards = document.querySelectorAll('.breed-card[data-breed-id]');
    
    if (!breedCards.length) return;
    
    // Create Intersection Observer for lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(async (entry) => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const breedId = card.dataset.breedId;
                const imageContainer = card.querySelector('.breed-image-container');
                const skeleton = card.querySelector('.breed-image-skeleton');
                
                // Stop observing this card
                observer.unobserve(card);
                
                if (breedId && imageContainer && skeleton) {
                    try {
                        // Faster API call with timeout
                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), 3000);
                        
                        const response = await fetch(`/api/breed-image/${breedId}`, {
                            signal: controller.signal
                        });
                        clearTimeout(timeoutId);
                        
                        const data = await response.json();
                        
                        if (data.image_url) {
                            const img = document.createElement('img');
                            img.src = data.image_url;
                            img.alt = `${card.querySelector('.card-title').textContent} cat`;
                            img.className = 'breed-image fade-in';
                            img.style.cssText = 'height: 250px; object-fit: cover; opacity: 0; transition: opacity 0.3s ease;';
                            
                            img.onload = function() {
                                skeleton.style.display = 'none';
                                imageContainer.appendChild(img);
                                img.style.opacity = '1';
                                card.classList.remove('loading-card');
                            };
                            
                            img.onerror = function() {
                                skeleton.innerHTML = '<i class="fas fa-cat fa-3x text-muted d-flex align-items-center justify-content-center h-100"></i>';
                                skeleton.classList.remove('skeleton');
                                card.classList.remove('loading-card');
                            };
                        } else {
                            skeleton.innerHTML = '<i class="fas fa-cat fa-3x text-muted d-flex align-items-center justify-content-center h-100"></i>';
                            skeleton.classList.remove('skeleton');
                            card.classList.remove('loading-card');
                        }
                    } catch (error) {
                        if (error.name !== 'AbortError') {
                            console.error('Error loading breed image:', error);
                        }
                        skeleton.innerHTML = '<i class="fas fa-cat fa-3x text-muted d-flex align-items-center justify-content-center h-100"></i>';
                        skeleton.classList.remove('skeleton');
                        card.classList.remove('loading-card');
                    }
                }
            }
        });
    }, {
        rootMargin: '50px', // Start loading when element is 50px away from viewport
        threshold: 0.1
    });
    
    // Observe all breed cards for lazy loading
    breedCards.forEach(card => {
        imageObserver.observe(card);
    });
}

// Function to load all available breeds
async function loadAllBreeds() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const loadingMore = document.getElementById('loadingMore');
    const breedsContainer = document.getElementById('breedsContainer');
    
    if (!loadMoreBtn || !breedsContainer) return;
    
    // Show loading state
    loadMoreBtn.style.display = 'none';
    loadingMore.classList.remove('d-none');
    
    try {
        const response = await fetch('/api/all-breeds');
        const data = await response.json();
        
        if (data.breeds && data.breeds.length > 0) {
            // Get currently displayed breeds to avoid duplicates
            const currentBreedIds = Array.from(document.querySelectorAll('.breed-card[data-breed-id]'))
                .map(card => card.dataset.breedId);
            
            // Filter out breeds that are already displayed
            const newBreeds = data.breeds.filter(breed => !currentBreedIds.includes(breed.id));
            
            // Add new breed cards
            newBreeds.forEach((breed, index) => {
                const breedCard = createBreedCard(breed);
                breedsContainer.insertBefore(breedCard, breedsContainer.lastElementChild); // Insert before "Back to Home" row
                
                // Load image for this breed with a delay
                setTimeout(() => loadSingleBreedImage(breed.id), index * 100);
            });
            
            // Update search functionality
            initializeBreedSearch();
            
            // Update button text
            loadMoreBtn.innerHTML = `<i class="fas fa-check"></i> All ${data.total_count} Breeds Loaded`;
            loadMoreBtn.disabled = true;
            loadMoreBtn.classList.replace('btn-warning', 'btn-success');
        }
    } catch (error) {
        console.error('Error loading all breeds:', error);
        loadMoreBtn.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Error Loading Breeds`;
        loadMoreBtn.classList.replace('btn-warning', 'btn-danger');
    } finally {
        loadingMore.classList.add('d-none');
        loadMoreBtn.style.display = 'inline-block';
    }
}

// Function to create a breed card HTML element
function createBreedCard(breed) {
    const col = document.createElement('div');
    col.className = 'col-lg-6 col-xl-4 mb-4';
    
    col.innerHTML = `
        <div class="card h-100 shadow-sm breed-card loading-card fade-in" data-breed-id="${breed.id}">
            <div class="card-header bg-light">
                <h5 class="card-title mb-0">${breed.name}</h5>
                ${breed.origin ? `<small class="text-muted"><i class="fas fa-globe"></i> Origin: ${breed.origin}</small>` : ''}
            </div>
            <div class="card-body">
                <div class="breed-image-container">
                    <div class="breed-image-skeleton skeleton"></div>
                </div>
                ${breed.description ? `<p class="card-text">${breed.description.substring(0, 150)}${breed.description.length > 150 ? '...' : ''}</p>` : ''}
                
                <div class="breed-info">
                    ${breed.temperament ? `
                        <p><strong><span class="paw-icon"></span> Temperament:</strong><br>
                        ${breed.temperament.split(',').slice(0, 3).map(temp => `<span class="badge bg-secondary me-1">${temp.trim()}</span>`).join('')}
                        </p>
                    ` : ''}
                    
                    ${breed.life_span ? `<p><strong><i class="fas fa-clock"></i> Life Span:</strong> ${breed.life_span} years</p>` : ''}
                    
                    ${breed.weight && breed.weight.metric ? `<p><strong><i class="fas fa-weight"></i> Weight:</strong> ${breed.weight.metric} kg</p>` : ''}
                </div>
                
                <div class="breed-ratings mt-3">
                    ${breed.energy_level ? `
                        <div class="mb-1">
                            <small><strong>Energy Level:</strong></small>
                            <div class="rating-stars">
                                ${[1,2,3,4,5].map(i => `<i class="fa${i <= breed.energy_level ? 's' : 'r'} fa-star text-warning"></i>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${breed.affection_level ? `
                        <div class="mb-1">
                            <small><strong>Affection Level:</strong></small>
                            <div class="rating-stars">
                                ${[1,2,3,4,5].map(i => `<i class="fa${i <= breed.affection_level ? 's' : 'r'} fa-heart text-danger"></i>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
            ${breed.wikipedia_url ? `
                <div class="card-footer">
                    <a href="${breed.wikipedia_url}" target="_blank" class="btn btn-outline-primary btn-sm">
                        <i class="fab fa-wikipedia-w"></i> Learn More
                    </a>
                </div>
            ` : ''}
        </div>
    `;
    
    return col;
}

// Function to load a single breed image
async function loadSingleBreedImage(breedId) {
    const card = document.querySelector(`[data-breed-id="${breedId}"]`);
    if (!card) return;
    
    const imageContainer = card.querySelector('.breed-image-container');
    const skeleton = card.querySelector('.breed-image-skeleton');
    
    if (imageContainer && skeleton) {
        try {
            const response = await fetch(`/api/breed-image/${breedId}`);
            const data = await response.json();
            
            if (data.image_url) {
                const img = document.createElement('img');
                img.src = data.image_url;
                img.alt = `${card.querySelector('.card-title').textContent} cat`;
                img.className = 'breed-image fade-in';
                
                img.onload = function() {
                    skeleton.style.display = 'none';
                    imageContainer.appendChild(img);
                    card.classList.remove('loading-card');
                };
            } else {
                skeleton.innerHTML = '<i class="fas fa-cat fa-3x text-muted d-flex align-items-center justify-content-center h-100"></i>';
                skeleton.classList.remove('skeleton');
                card.classList.remove('loading-card');
            }
        } catch (error) {
            console.error('Error loading breed image:', error);
            skeleton.innerHTML = '<i class="fas fa-cat fa-3x text-muted d-flex align-items-center justify-content-center h-100"></i>';
            skeleton.classList.remove('skeleton');
            card.classList.remove('loading-card');
        }
    }
}

// Search functionality for breeds page
function initializeBreedSearch() {
    const searchInput = document.getElementById('breedSearch');
    const clearButton = document.getElementById('clearSearch');
    const breedsContainer = document.getElementById('breedsContainer');
    const noResults = document.getElementById('noResults');
    const searchInfo = document.getElementById('searchInfo');
    const resultsCount = document.getElementById('resultsCount');
    
    if (!searchInput) return; // Not on breeds page
    
    const allBreedCards = Array.from(document.querySelectorAll('.breed-card'));
    const totalBreeds = allBreedCards.length;
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;
        
        // Get current breed cards (in case more were loaded)
        const currentBreedCards = Array.from(document.querySelectorAll('.breed-card'));
        const currentTotal = currentBreedCards.length;
        
        currentBreedCards.forEach(card => {
            const breedName = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
            const breedOrigin = card.querySelector('small')?.textContent.toLowerCase() || '';
            const breedTemp = card.querySelector('.breed-info')?.textContent.toLowerCase() || '';
            const breedDesc = card.querySelector('.card-text')?.textContent.toLowerCase() || '';
            
            const isMatch = breedName.includes(searchTerm) || 
                          breedOrigin.includes(searchTerm) || 
                          breedTemp.includes(searchTerm) ||
                          breedDesc.includes(searchTerm);
            
            if (isMatch) {
                card.closest('.col-lg-6, .col-xl-4').style.display = 'block';
                card.classList.add('fade-in');
                visibleCount++;
            } else {
                card.closest('.col-lg-6, .col-xl-4').style.display = 'none';
            }
        });
        
        // Update results info
        resultsCount.textContent = visibleCount;
        searchInfo.innerHTML = `<span id="resultsCount">${visibleCount}</span> of ${currentTotal} breeds found`;
        
        // Show/hide no results message
        if (visibleCount === 0 && searchTerm) {
            noResults.classList.remove('d-none');
        } else {
            noResults.classList.add('d-none');
        }
    }
    
    function clearSearch() {
        searchInput.value = '';
        const currentBreedCards = Array.from(document.querySelectorAll('.breed-card'));
        const currentTotal = currentBreedCards.length;
        
        currentBreedCards.forEach(card => {
            card.closest('.col-lg-6, .col-xl-4').style.display = 'block';
        });
        resultsCount.textContent = currentTotal;
        searchInfo.innerHTML = `<span id="resultsCount">${currentTotal}</span> breeds found`;
        noResults.classList.add('d-none');
        searchInput.focus();
    }
    
    // Event listeners
    searchInput.addEventListener('input', performSearch);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Escape') {
            clearSearch();
        }
    });
    
    clearButton.addEventListener('click', clearSearch);
    
    // Make clearSearch function global
    window.clearSearch = clearSearch;
}

// Removed pagination functionality - showing all breeds at once



// Breed count update function removed - showing all breeds at once

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('PurrfectPics loaded successfully! 🐱');
    
    // Load breed images if on breeds page
    if (window.location.pathname === '/breeds') {
        loadBreedImages();
        initializeBreedSearch();
    }
    
    // Add smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading animation to images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + R for new cat (prevent default refresh)
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        getNewCat();
    }
    
    // Ctrl/Cmd + F for new fact
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        getNewFact();
    }
});

// Add tooltip functionality
function addTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = e.target.getAttribute('data-tooltip');
    tooltip.style.cssText = `
        position: absolute;
        background: #333;
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 1000;
        pointer-events: none;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
}

function hideTooltip() {
    const tooltip = document.querySelector('.custom-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}