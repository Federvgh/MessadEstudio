#!/bin/bash

# Script to update all HTML pages with Azure authentication

echo "🚀 Updating HTML pages with Azure authentication..."

# Array of files to update (excluding index.html which is already done)
files=("about.html" "contact.html" "projects.html" "services.html" "institucional.html" "comercial.html" "vivienda.html" "edificios.html")

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "📝 Updating $file..."
        
        # Add MSAL script tag before closing head tag if not already present
        if ! grep -q "msal-browser.min.js" "$file"; then
            sed -i '' '/<\/head>/i\
\	<!-- MSAL.js for Azure Authentication -->\
\	<script src="https://alcdn.msauth.net/browser/2.38.0/js/msal-browser.min.js"></script>\
' "$file"
        fi
        
        # Add login button to navigation if not already present
        if ! grep -q 'id="loginBtn"' "$file"; then
            sed -i '' 's/<li><a href="contact\.html">Contacto<\/a><\/li>/<li><a href="contact.html">Contacto<\/a><\/li>\
\					<li><a href="#" id="loginBtn">Login<\/a><\/li>/g' "$file"
        fi
        
        echo "✅ $file updated successfully"
    else
        echo "⚠️  $file not found"
    fi
done

echo ""
echo "🎯 All pages updated with authentication setup!"
echo ""
echo "📋 Next steps:"
echo "1. Follow the Azure setup guide to configure your tenant"
echo "2. Update js/auth-config.js with your Azure configuration"
echo "3. Test the authentication flow"
echo "4. Add login modals to pages that need them"
