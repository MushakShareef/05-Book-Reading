
document.addEventListener('DOMContentLoaded', function () {
  const book = document.querySelector('.book');
  const pages = document.querySelectorAll('.page');

  let currentPage = 1;
  const totalPages = pages.length;

  let isMouseDown = false;
  let startX = 0;
  let endX = 0;
  let isDragging = false;
  const dragThreshold = 10;

  const leftTouch = document.createElement('div');
  leftTouch.className = 'touch-area left-touch';
  const rightTouch = document.createElement('div');
  rightTouch.className = 'touch-area right-touch';
  book.appendChild(leftTouch);
  book.appendChild(rightTouch);

  book.addEventListener('mousedown', function (e) {
    isMouseDown = true;
    startX = e.clientX;
    isDragging = false;
  });

  book.addEventListener('mousemove', function (e) {
    if (isMouseDown) {
      const moveX = e.clientX - startX;
      if (Math.abs(moveX) > dragThreshold) {
        isDragging = true;
      }
    }
  });

  book.addEventListener('mouseup', function (e) {
    if (isMouseDown && isDragging) {
      endX = e.clientX;
      const dragDistance = endX - startX;

      if (dragDistance > 50) goToPrevPage();
      else if (dragDistance < -50) goToNextPage();
    }
    isMouseDown = false;
  });

  book.addEventListener('mouseleave', function () {
    isMouseDown = false;
  });

  let touchStartX = 0;
  let touchEndX = 0;

  book.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  });

  book.addEventListener('touchend', function (e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    if (swipeDistance > 50) goToPrevPage();
    else if (swipeDistance < -50) goToNextPage();
  }

  function goToNextPage() {
    if (currentPage < totalPages) {
        const currentPageElement = document.getElementById(`page-${currentPage}`);
        const nextPageElement = document.getElementById(`page-${currentPage + 1}`);

        // ✅ Step 1: Make sure next page is visible immediately
        nextPageElement.classList.add('current-page');

        // ✅ Step 2: Add flip animation to current
        currentPageElement.classList.add('flipping-forward');

        // ✅ Step 3: Finish the transition
        setTimeout(() => {
            currentPageElement.classList.remove('current-page');
            currentPageElement.classList.remove('flipping-forward');

            currentPage++;
        }, 700); // match animation duration
    }
}


  function goToPrevPage() {
    if (currentPage > 1) {
        const currentPageElement = document.getElementById(`page-${currentPage}`);
        const prevPageElement = document.getElementById(`page-${currentPage - 1}`);

        prevPageElement.classList.add('current-page');
        prevPageElement.classList.add('flipping-backward');

        setTimeout(() => {
            currentPageElement.classList.remove('current-page');
            prevPageElement.classList.remove('flipping-backward');

            currentPage--;
        }, 700);
    }
}


  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goToPrevPage();
    else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToNextPage();
  });

  book.addEventListener('mousemove', function (e) {
    const bookWidth = book.offsetWidth;
    const mouseX = e.offsetX;
    book.style.cursor = (mouseX < bookWidth / 2 && currentPage > 1) ? 'w-resize'
                      : (mouseX >= bookWidth / 2 && currentPage < totalPages) ? 'e-resize'
                      : 'not-allowed';
  });
});
