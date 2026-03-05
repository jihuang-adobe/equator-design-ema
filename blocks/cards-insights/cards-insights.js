function updateActiveSlide(block, slideIndex) {
  const slides = block.querySelectorAll('.cards-insights-slide');
  block.dataset.activeSlide = slideIndex;

  slides.forEach((slide, idx) => {
    slide.setAttribute('aria-hidden', idx !== slideIndex);
  });

  const indicators = block.querySelectorAll('.cards-insights-indicator');
  indicators.forEach((indicator, idx) => {
    if (idx !== slideIndex) {
      indicator.querySelector('button').removeAttribute('disabled');
    } else {
      indicator.querySelector('button').setAttribute('disabled', 'true');
    }
  });
}

function showSlide(block, slideIndex = 0) {
  const slides = block.querySelectorAll('.cards-insights-slide');
  let realIndex = slideIndex < 0 ? slides.length - 1 : slideIndex;
  if (slideIndex >= slides.length) realIndex = 0;
  const activeSlide = slides[realIndex];

  block.querySelector('.cards-insights-slides').scrollTo({
    top: 0,
    left: activeSlide.offsetLeft,
    behavior: 'smooth',
  });
}

export default function decorate(block) {
  const rows = [...block.children];
  const slideCount = rows.length;

  /* build slides */
  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('cards-insights-slides');

  rows.forEach((row, idx) => {
    const slide = document.createElement('li');
    slide.classList.add('cards-insights-slide');
    slide.dataset.slideIndex = idx;

    while (row.firstElementChild) {
      const div = row.firstElementChild;
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-insights-card-image';
      } else {
        div.className = 'cards-insights-card-body';
      }
      slide.append(div);
    }
    slidesWrapper.append(slide);
    row.remove();
  });

  block.textContent = '';

  /* slides container with nav buttons */
  const container = document.createElement('div');
  container.classList.add('cards-insights-slides-container');

  if (slideCount > 1) {
    const navButtons = document.createElement('div');
    navButtons.classList.add('cards-insights-nav-buttons');
    navButtons.innerHTML = `
      <button type="button" class="slide-prev" aria-label="Previous Slide"></button>
      <button type="button" class="slide-next" aria-label="Next Slide"></button>
    `;
    container.append(navButtons);
  }

  container.append(slidesWrapper);
  block.append(container);

  /* dot indicators */
  if (slideCount > 1) {
    const indicatorsNav = document.createElement('nav');
    indicatorsNav.setAttribute('aria-label', 'Insight Slide Controls');
    const indicators = document.createElement('ol');
    indicators.classList.add('cards-insights-indicators');

    for (let i = 0; i < slideCount; i += 1) {
      const indicator = document.createElement('li');
      indicator.classList.add('cards-insights-indicator');
      indicator.dataset.targetSlide = i;
      indicator.innerHTML = `<button type="button" aria-label="Show Slide ${i + 1} of ${slideCount}"></button>`;
      indicators.append(indicator);
    }

    indicatorsNav.append(indicators);
    block.append(indicatorsNav);
  }

  /* bind events */
  if (slideCount > 1) {
    block.querySelector('.slide-prev').addEventListener('click', () => {
      showSlide(block, parseInt(block.dataset.activeSlide, 10) - 1);
    });
    block.querySelector('.slide-next').addEventListener('click', () => {
      showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
    });

    block.querySelectorAll('.cards-insights-indicator button').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const indicator = e.currentTarget.parentElement;
        showSlide(block, parseInt(indicator.dataset.targetSlide, 10));
      });
    });

    const slideObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = parseInt(entry.target.dataset.slideIndex, 10);
          updateActiveSlide(block, idx);
        }
      });
    }, { threshold: 0.5 });

    slidesWrapper.querySelectorAll('.cards-insights-slide').forEach((slide) => {
      slideObserver.observe(slide);
    });
  }

  block.dataset.activeSlide = 0;
}
