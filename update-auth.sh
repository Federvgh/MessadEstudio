#!/bin/bash

# Script to update all HTML pages with Azure AD B2C authentication

echo "Updating HTML pages with Azure AD B2C authentication..."

# Array of files to update (excluding index.html and about.html which are already done)
files=("contact.html" "projects.html" "services.html" "institucional.html" "comercial.html" "vivienda.html" "edificios.html")

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "Updating $file..."
        
        # Add MSAL script tag before closing head tag if not already present
        if ! grep -q "msal-browser.min.js" "$file"; then
            sed -i '' '/<\/head>/i\
\	<!-- MSAL.js for Azure AD B2C Authentication -->\
\	<script src="https://alcdn.msauth.net/browser/2.38.0/js/msal-browser.min.js"></script>\
' "$file"
        fi
        
        echo "✓ $file updated successfully"
    else
        echo "⚠ $file not found"
    fi
done

echo "✅ All pages updated with Azure AD B2C authentication setup!"
echo ""
echo "Next steps:"
echo "1. Follow the AZURE_SETUP_GUIDE.md to configure your Azure AD B2C tenant"
echo "2. Update js/auth-config.js with your Azure configuration"
echo "3. Test the authentication flow"
