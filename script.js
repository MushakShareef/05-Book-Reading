
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
      const current = document.getElementById(`page-${currentPage}`);
      const next = document.getElementById(`page-${currentPage + 1}`);

      current.classList.add('flipping-forward');

      setTimeout(() => {
        current.classList.remove('current-page');
        current.classList.remove('flipping-forward');
        // current.style.display = 'none';
        next.classList.add('current-page');
        currentPage++;
      }, 700);
    }
  }

  function goToPrevPage() {
    if (currentPage > 1) {
      const current = document.getElementById(`page-${currentPage}`);
      const prev = document.getElementById(`page-${currentPage - 1}`);

      prev.style.display = 'block';
      prev.classList.add('flipping-backward');

      setTimeout(() => {
        current.classList.remove('current-page');
        prev.classList.remove('flipping-backward');
        prev.classList.add('current-page');
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
