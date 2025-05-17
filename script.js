
// Mobile Book Page Turner JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const book = document.querySelector('.book');
    const pages = document.querySelectorAll('.page');
    const pageCounter = document.getElementById('page-counter');
    
    // Set initial state
    let currentPage = 1;
    const totalPages = pages.length;
    
    // Mouse tracking variables
    let isMouseDown = false;
    let startX = 0;
    let endX = 0;
    let isDragging = false;
    const dragThreshold = 10; // Minimum pixels to consider it a drag rather than a click
    
    // Add touch areas for visual guidance (optional)
    const leftTouch = document.createElement('div');
    leftTouch.className = 'touch-area left-touch';
    const rightTouch = document.createElement('div');
    rightTouch.className = 'touch-area right-touch';
    book.appendChild(leftTouch);
    book.appendChild(rightTouch);
    
    // Event listeners for mouse-based navigation
    book.addEventListener('mousedown', function(e) {
        isMouseDown = true;
        startX = e.clientX;
        isDragging = false;
    });
    
    book.addEventListener('mousemove', function(e) {
        if (isMouseDown) {
            const moveX = e.clientX - startX;
            if (Math.abs(moveX) > dragThreshold) {
                isDragging = true;
            }
        }
    });
    
    book.addEventListener('mouseup', function(e) {
        if (isMouseDown && isDragging) {
            endX = e.clientX;
            const dragDistance = endX - startX;
            
            if (dragDistance > 50) {
                // Left to right movement - go to previous page
                goToPrevPage();
            } else if (dragDistance < -50) {
                // Right to left movement - go to next page
                goToNextPage();
            }
        }
        
        isMouseDown = false;
    });
    
    book.addEventListener('mouseleave', function() {
        isMouseDown = false;
    });
    
    // Add touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    book.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    book.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        const swipeThreshold = 50; // Minimum required distance for swipe
        const swipeDistance = touchEndX - touchStartX;
        
        if (swipeDistance > swipeThreshold) {
            // Swiped right - go to previous page
            goToPrevPage();
        } else if (swipeDistance < -swipeThreshold) {
            // Swiped left - go to next page
            goToNextPage();
        }
    }
    
    // Function to turn to the next page
    function goToNextPage() {
        // Check if we're not already at last page
        if (currentPage < totalPages) {
            // Animate the page flip
            const currentPageElement = document.getElementById(`page-${currentPage}`);
            const nextPageElement = document.getElementById(`page-${currentPage + 1}`);
            
            // Add flipping animation class
            currentPageElement.classList.add('flipping-forward');
            
            // Wait for animation to complete before updating state
            setTimeout(() => {
                // Remove current-page class from current page
                currentPageElement.classList.remove('current-page');
                currentPageElement.classList.remove('flipping-forward');
                currentPageElement.style.display = 'none';
                
                // Add current-page class to next page
                nextPageElement.classList.add('current-page');
                
                // Update current page indicator
                currentPage++;
                updateCounter();
                updateButtons();
            }, 700); // Slightly shorter than animation duration
        }
    }
    
    // Function to go back to the previous page
    function goToPrevPage() {
        // Check if we're not already at first page
        if (currentPage > 1) {
            // Animate the page flip
            const currentPageElement = document.getElementById(`page-${currentPage}`);
            const prevPageElement = document.getElementById(`page-${currentPage - 1}`);
            
            // Setup for backward flip
            prevPageElement.style.display = 'block';
            prevPageElement.classList.add('flipping-backward');
            
            // Wait for animation to complete
            setTimeout(() => {
                // Remove current-page class from current page
                currentPageElement.classList.remove('current-page');
                
                // Remove animation class and make previous page current
                prevPageElement.classList.remove('flipping-backward');
                prevPageElement.classList.add('current-page');
                
                // Update current page indicator
                currentPage--;
                updateCounter();
            }, 700); // Slightly shorter than animation duration
        }
    }
    
    function updateCounter() {
        pageCounter.textContent = `Page ${currentPage} of ${totalPages}`;
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            goToPrevPage();
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            goToNextPage();
        }
    });
    
    // Visual feedback for cursor interaction
    book.addEventListener('mousemove', function(e) {
        const bookWidth = book.offsetWidth;
        const mouseX = e.offsetX;
        
        if (mouseX < bookWidth / 2) {
            // Left side - show previous cursor
            book.style.cursor = currentPage > 1 ? 'w-resize' : 'not-allowed';
        } else {
            // Right side - show next cursor
            book.style.cursor = currentPage < totalPages ? 'e-resize' : 'not-allowed';
        }
    });
});

const flipSound = new Audio('flip.mp3');
flipSound.play();
