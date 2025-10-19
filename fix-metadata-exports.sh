#!/bin/bash

# Script to remove problematic metadata exports from Next.js client components

echo "🔍 Finding and fixing files with unsupported metadata exports..."

# Find all .js and .jsx files in the app directory
find app -type f \( -name "*.js" -o -name "*.jsx" \) | while read file; do
  # Check if file contains "use client"
  if grep -q '"use client"' "$file" || grep -q "'use client'" "$file"; then
    
    # Check if file has ANY problematic metadata exports
    if grep -q "export const dynamic" "$file" || grep -q "export const revalidate" "$file" || grep -q "export const viewport" "$file" || grep -q "export const themeColor" "$file" || grep -q "export const metadata" "$file"; then
      echo "📝 Fixing: $file"
      
      # Remove ALL metadata-related exports from client components
      # This works on both Linux and macOS
      sed -i.bak '/^export const dynamic/d' "$file"
      sed -i.bak '/^export const revalidate/d' "$file"
      sed -i.bak '/^export const viewport/d' "$file"
      sed -i.bak '/^export const themeColor/d' "$file"
      sed -i.bak '/^export const metadata/d' "$file"
      
      # Remove backup files
      rm -f "${file}.bak"
      
      echo "   ✅ Fixed: $file"
    fi
  fi
done

echo ""
echo "🎉 Done! All files have been fixed."
echo ""
echo "Next steps:"
echo "1. Run: npm run build"
echo "2. If successful, commit: git add . && git commit -m 'fix: remove metadata exports from client components'"
echo "3. Push: git push"
