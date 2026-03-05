/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-showcase block
 *
 * Source: https://equator-design.com/
 * Base Block: carousel
 *
 * Block Structure (from carousel markdown example):
 * - Row 1: Block name header ("Carousel-Showcase")
 * - Row 2-N: One row per slide, each containing an image
 *
 * Source HTML Pattern (from captured DOM):
 * <section class="homepage-hero slider">
 *   <div class="primary-container h-100">...</div>
 *   <div class="hero-background-slider w-100 h-100">
 *     <div class="hero-slide h-100 w-100">
 *       <img src="./images/..." alt="Hero Slide">
 *     </div>
 *     ... (multiple slides)
 *   </div>
 * </section>
 *
 * Generated: 2026-03-04
 */
export default function parse(element, { document }) {
  // Extract slide images from hero background slider
  // VALIDATED: Found in captured DOM <div class="hero-slide"> containing <img> elements
  const slides = element.querySelectorAll('.hero-slide');
  const cells = [];

  slides.forEach((slide) => {
    // VALIDATED: Each .hero-slide contains an <img> with src and alt attributes
    const img = slide.querySelector('img');
    if (img && img.src && !img.src.startsWith('data:image/svg+xml')) {
      // Only include slides with actual images (skip placeholder SVGs)
      const imgEl = document.createElement('img');
      imgEl.src = img.src;
      imgEl.alt = img.alt || '';
      cells.push([imgEl]);
    }
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Carousel-Showcase', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
