/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-portfolio block
 *
 * Source: https://equator-design.com/
 * Base Block: cards
 *
 * Block Structure (from cards markdown example):
 * - Row 1: Block name header ("Cards-Portfolio")
 * - Row 2-N: One row per card, 2 columns (image | title with link)
 *
 * Source HTML Pattern (from captured DOM):
 * <section class="portfolio-showcase">
 *   <div class="primary-container">
 *     <div class="portfolio-showcase-wrapper">
 *       <h2>Our Work</h2>
 *       <div class="portfolio-items">
 *         <div class="portfolio-item">
 *           <a class="portfolio-item-image" href="...">
 *             <div><img src="..." alt="..."></div>
 *           </a>
 *           <div class="portfolio-item-content">
 *             <a href="..."><h3>Title</h3></a>
 *           </div>
 *         </div>
 *         ... (multiple items)
 *       </div>
 *       <div class="button-wrapper">
 *         <a class="button" href="...">View More</a>
 *       </div>
 *     </div>
 *   </div>
 * </section>
 *
 * Note: The H2 "Our Work" heading and "View More" button are default content
 * surrounding the block. They are preserved outside the block table by the
 * import script. This parser only extracts the portfolio items into cards.
 *
 * Generated: 2026-03-04
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract portfolio items
  // VALIDATED: Found in captured DOM <div class="portfolio-item item-N">
  const items = element.querySelectorAll('.portfolio-item');

  items.forEach((item) => {
    // Column 1: Image
    // VALIDATED: Found <a class="portfolio-item-image"><div><img src="..." alt="..."></div></a>
    const img = item.querySelector('.portfolio-item-image img') ||
                item.querySelector('img');

    const imgEl = document.createElement('img');
    if (img) {
      imgEl.src = img.src;
      imgEl.alt = img.alt || '';
    }

    // Column 2: Title with link
    // VALIDATED: Found <div class="portfolio-item-content"><a href="..."><h3>Title</h3></a></div>
    const titleLink = item.querySelector('.portfolio-item-content a') ||
                      item.querySelector('a[title]');
    const titleHeading = item.querySelector('.portfolio-item-content h3') ||
                         item.querySelector('h3');

    const contentCell = [];
    if (titleLink && titleHeading) {
      const a = document.createElement('a');
      a.href = titleLink.href;
      const strong = document.createElement('strong');
      strong.textContent = titleHeading.textContent.trim();
      a.appendChild(strong);
      contentCell.push(a);
    } else if (titleHeading) {
      const strong = document.createElement('strong');
      strong.textContent = titleHeading.textContent.trim();
      contentCell.push(strong);
    }

    cells.push([imgEl, contentCell]);
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Portfolio', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
