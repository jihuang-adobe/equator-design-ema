/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-insights block
 *
 * Source: https://equator-design.com/
 * Base Block: cards
 *
 * Block Structure (from cards markdown example):
 * - Row 1: Block name header ("Cards-Insights")
 * - Row 2-N: One row per card, 2 columns (image | title + date + excerpt + CTA link)
 *
 * Source HTML Pattern (from captured DOM):
 * <section class="insights-slider">
 *   <div class="primary-container">
 *     <div class="insights-slider-wrapper">
 *       <div class="section-title">
 *         <h2>The Latest</h2>
 *         <a class="button" href="...">View All</a>
 *       </div>
 *       <div class="insight-items">
 *         <a class="insight-item" href="...">
 *           <div class="insight-item-wrapper h-100">
 *             <div class="left">
 *               <img src="..." alt="...">
 *               <h3>Title</h3>
 *             </div>
 *             <div class="right">
 *               <span class="date desktop">23 January 2026</span>
 *               <span class="date mobile">23/01/26</span>
 *               <h3>Title</h3>
 *               <div class="excerpt excerpt-odd">Excerpt text...</div>
 *               <span class="button">Read More</span>
 *             </div>
 *           </div>
 *         </a>
 *         ... (multiple items)
 *       </div>
 *     </div>
 *   </div>
 * </section>
 *
 * Note: The H2 "The Latest" heading and "View All" button are default content
 * surrounding the block. This parser only extracts the insight items into cards.
 *
 * Generated: 2026-03-04
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract insight items
  // VALIDATED: Found in captured DOM <a class="insight-item" href="...">
  const items = element.querySelectorAll('.insight-item');

  items.forEach((item) => {
    // Column 1: Image
    // VALIDATED: Found <div class="left"><img src="..." alt="...">
    const img = item.querySelector('.left img') ||
                item.querySelector('img');

    const imgEl = document.createElement('img');
    if (img && img.src && !img.src.startsWith('data:image/svg+xml')) {
      imgEl.src = img.src;
      imgEl.alt = img.alt || '';
    }

    // Column 2: Title + date + excerpt + CTA link
    const contentCell = [];

    // Title
    // VALIDATED: Found <div class="right"><h3>Title</h3> (use the right-side h3)
    const title = item.querySelector('.right h3') ||
                  item.querySelector('.left h3') ||
                  item.querySelector('h3');
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      contentCell.push(strong);
    }

    // Date (desktop version for full date format)
    // VALIDATED: Found <span class="date desktop">23 January 2026</span>
    const dateEl = item.querySelector('.date.desktop') ||
                   item.querySelector('.date');
    if (dateEl) {
      const p = document.createElement('p');
      p.textContent = dateEl.textContent.trim();
      contentCell.push(p);
    }

    // Excerpt (use the odd excerpt which has the longest text)
    // VALIDATED: Found <div class="excerpt excerpt-odd">Full excerpt text...</div>
    const excerpt = item.querySelector('.excerpt.excerpt-odd') ||
                    item.querySelector('.excerpt');
    if (excerpt) {
      const p = document.createElement('p');
      p.textContent = excerpt.textContent.trim();
      contentCell.push(p);
    }

    // CTA link - using the parent anchor href
    // VALIDATED: Found <a class="insight-item" href="..."> as the parent element
    if (item.href) {
      const a = document.createElement('a');
      a.href = item.href;
      a.textContent = 'Read More';
      contentCell.push(a);
    }

    cells.push([imgEl, contentCell]);
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Insights', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
