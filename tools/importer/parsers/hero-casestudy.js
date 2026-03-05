/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-casestudy block
 *
 * Source: https://equator-design.com/
 * Base Block: hero
 *
 * Block Structure (from hero markdown example):
 * - Row 1: Block name header ("Hero-Casestudy")
 * - Row 2: Background image
 * - Row 3: Content (client name, tagline heading, description, link)
 *
 * Source HTML Pattern (from captured DOM):
 * <section class="featured-case-study">
 *   <a class="featured-image" href="...">
 *     <div class="featured-image-wrapper">
 *       <img class="bg" src="..." alt="...">
 *     </div>
 *   </a>
 *   <div class="primary-container">
 *     <div class="featured-case-study-wrapper">
 *       <div class="tagline">
 *         <a href="...">
 *           <b class="client">Client Name</b>
 *           <h2><b>Tagline</b></h2>
 *         </a>
 *       </div>
 *       <div class="intro">
 *         <p>Description text</p>
 *       </div>
 *     </div>
 *   </div>
 * </section>
 *
 * Generated: 2026-03-04
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract background image
  // VALIDATED: Found in captured DOM <img class="bg"> inside <a class="featured-image">
  const bgImg = element.querySelector('.featured-image img.bg') ||
                element.querySelector('.featured-image-wrapper img') ||
                element.querySelector('.featured-image img');

  if (bgImg) {
    const imgEl = document.createElement('img');
    imgEl.src = bgImg.src;
    imgEl.alt = bgImg.alt || '';
    cells.push([imgEl]);
  }

  // Extract content: client name, tagline, description, and link
  // Build a single content cell combining all text elements
  const contentCell = [];

  // VALIDATED: Found in captured DOM <b class="client">Co-op</b>
  const clientName = element.querySelector('.client') ||
                     element.querySelector('.tagline b:first-child');
  if (clientName) {
    const strong = document.createElement('strong');
    strong.textContent = clientName.textContent.trim();
    contentCell.push(strong);
  }

  // VALIDATED: Found in captured DOM <h2><b>Tagline text</b></h2> inside .tagline
  const tagline = element.querySelector('.tagline h2') ||
                  element.querySelector('.featured-case-study-wrapper h2');
  if (tagline) {
    const h2 = document.createElement('h2');
    h2.textContent = tagline.textContent.trim();
    contentCell.push(h2);
  }

  // VALIDATED: Found in captured DOM <div class="intro"><p>Description</p></div>
  const introText = element.querySelector('.intro p') ||
                    element.querySelector('.intro');
  if (introText) {
    const p = document.createElement('p');
    p.textContent = introText.textContent.trim();
    contentCell.push(p);
  }

  // VALIDATED: Found in captured DOM <a class="featured-image" href="...">
  const link = element.querySelector('a.featured-image') ||
               element.querySelector('.tagline a');
  if (link && link.href) {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = 'View Case Study';
    contentCell.push(a);
  }

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero-Casestudy', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
