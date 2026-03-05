/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for Equator Design website cleanup
 * Purpose: Remove non-content elements (header, footer, decorative elements)
 * Applies to: equator-design.com (all templates)
 * Generated: 2026-03-04
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow (cleaned.html)
 * - Page structure analysis from equator-design.com homepage
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform'
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove site header/navigation
    // EXTRACTED: Found in captured DOM <header class="header">
    WebImporter.DOMUtils.remove(element, [
      'header.header'
    ]);

    // Remove site footer
    // EXTRACTED: Found in captured DOM <footer>
    WebImporter.DOMUtils.remove(element, [
      'footer'
    ]);

    // Remove decorative stamp element in hero section
    // EXTRACTED: Found in captured DOM <div class="stamp"> with rotating image and arrow
    WebImporter.DOMUtils.remove(element, [
      '.stamp'
    ]);

    // Remove hero anchor span
    // EXTRACTED: Found in captured DOM <span id="hero-anchor">
    WebImporter.DOMUtils.remove(element, [
      '#hero-anchor'
    ]);

    // Remove slider navigation arrows (not content)
    // EXTRACTED: Found in captured DOM <div class="slick-arrows"> with prev/next spans
    WebImporter.DOMUtils.remove(element, [
      '.slick-arrows'
    ]);

    // Remove placeholder SVG images (lazy-loaded images that never loaded)
    // EXTRACTED: Found multiple img elements with data:image/svg+xml placeholder src
    const placeholderImages = element.querySelectorAll('img[src^="data:image/svg+xml"]');
    placeholderImages.forEach((img) => {
      img.remove();
    });
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove remaining non-content elements
    WebImporter.DOMUtils.remove(element, [
      'noscript',
      'link'
    ]);
  }
}
