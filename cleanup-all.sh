#!/bin/bash

# Remove unnecessary HTML files
echo "Removing unnecessary HTML files..."
rm -f thank-you.html
rm -f booking-confirmation.html
rm -f services.html
rm -f pricing.html
rm -f gallery.html
rm -f contact.html

# Remove unnecessary email templates
echo "Cleaning up email templates..."
# Keep only the essential templates
find email-templates -type f -not -name "booking-template.html" -not -name "contact-template.html" -delete

# Remove unnecessary CSS files
echo "Cleaning up CSS files..."
rm -f css/particles.css
# Keep only the essential CSS files
find css -type f -not -name "styles.css" -not -name "modern-framework.css" -not -name "modern-animations.css" -not -name "modern-components.css" -not -name "testimonials.css" -not -name "form-messages.css" -not -name "performance.css" -delete

# Remove unnecessary JS files
echo "Cleaning up JS files..."
# Keep only the essential JS files
find js -type f -not -name "script.js" -not -name "modern-framework.js" -not -name "modern-ui.js" -not -name "env-config.js" -not -name "testimonials.js" -delete
rm -rf js/libs

# Remove cleanup scripts
echo "Removing cleanup scripts..."
rm -f cleanup.sh
rm -f comprehensive_cleanup.sh
rm -f run_cleanup.sh

# Remove README files
echo "Removing README files..."
find . -name "README.md" -delete

# Remove sitemap.xml as it references non-existent pages
echo "Updating sitemap.xml..."
cat > sitemap.xml << EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.rjautodetailing.com/</loc>
    <lastmod>2023-06-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
EOF

echo "Cleanup complete. Only essential files remain."