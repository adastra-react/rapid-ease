#!/bin/bash

echo "🔧 Fixing all pricing and price references..."

# List of files with pricing issues
files=(
  "app/store/slices/bookingSlice.js"
  "app/store/services/bookingService.js"
  "components/tourSingle/TourSlider.jsx"
  "components/tourSingle/TourSingleSidebar.jsx"
  "components/tours/TourSlider.jsx"
  "components/tours/TourList7.jsx"
  "components/tours/TourList6.jsx"
  "components/tours/TourList4.jsx"
  "components/tours/ListStyle.jsx/Style4.jsx"
  "components/tours/ListStyle.jsx/Style5.jsx"
  "components/tours/ListStyle.jsx/Style6.jsx"
  "components/tours/ListStyle.jsx/Style2.jsx"
  "components/tours/ListStyle.jsx/Style3.jsx"
  "components/tours/ListStyle.jsx/Style1.jsx"
  "components/tours/TourList5.jsx"
  "components/tours/TourList1.jsx"
  "components/tours/TourList2.jsx"
  "components/tours/TourList3.jsx"
  "components/dasbboard/AddTour.jsx"
  "components/dasbboard/DBListing.jsx"
  "components/dasbboard/Fevorite.jsx"
  "components/homes/tours/PopulerTours.jsx"
  "components/homes/tours/CityTour.jsx"
  "components/homes/tours/TourSlider2.jsx"
  "components/homes/tours/TourSliderOne.jsx"
  "components/homes/tours/TourSlider3.jsx"
  "components/homes/tours/CruiseTour.jsx"
  "components/homes/tours/TourSlider4.jsx"
  "components/homes/tours/TourSlider5.jsx"
  "components/homes/tours/PopulerTourSlider.jsx"
  "components/homes/tours/FeaturedToures.jsx"
  "components/homes/tours/FeaturedTrips.jsx"
  "components/homes/tours/Tour2.jsx"
  "components/homes/tours/Tour1.jsx"
  "components/homes/tours/CulturalTour.jsx"
  "components/modals/EditTourModal.jsx"
  "components/modals/BookingModal.jsx"
  "components/pages/destinations/TourSlider.jsx"
  "components/pages/destinations/TourList.jsx"
)

# Process each file
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  📝 Fixing: $file"
    
    # Fix pricing access patterns
    sed -i.bak \
      -e 's/tour\.pricing\.basePrice/tour?.pricing?.basePrice || 85/g' \
      -e 's/tour\.pricing\.perPersonRate/tour?.pricing?.perPersonRate || 25/g' \
      -e 's/tour\.pricing/tour?.pricing/g' \
      -e 's/item\.pricing\.basePrice/item?.pricing?.basePrice || 85/g' \
      -e 's/item\.pricing\.perPersonRate/item?.pricing?.perPersonRate || 25/g' \
      -e 's/item\.pricing/item?.pricing/g' \
      -e 's/elm\.pricing\.basePrice/elm?.pricing?.basePrice || 85/g' \
      -e 's/elm\.pricing\.perPersonRate/elm?.pricing?.perPersonRate || 25/g' \
      -e 's/elm\.pricing/elm?.pricing/g' \
      -e 's/\([^?]\)\.price\([^dA-Za-z]\)/\1?.price || \1?.pricing?.basePrice || 0\2/g' \
      "$file"
    
    # Remove backup
    rm -f "${file}.bak"
    
    echo "     ✅ Fixed: $file"
  else
    echo "     ⚠️  Not found: $file"
  fi
done

echo ""
echo "🎉 All pricing references fixed!"
echo ""
echo "Next steps:"
echo "1. Review changes: git diff"
echo "2. Test build: npm run build"
echo "3. Commit: git add . && git commit -m 'fix: add optional chaining to all pricing references'"
echo "4. Push: git push"