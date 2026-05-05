// ============================================
// RESOURCES PAGE - FULLY DEBUGGED
// ============================================

(function() {
    'use strict';
    
    const INVESTOR_STATES = [
        "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
        "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
        "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
        "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
        "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
        "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
        "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
        "Wisconsin", "Wyoming"
    ];
    
    const INVESTOR_CITIES = [
        "Albuquerque NM", "Atlanta GA", "Austin TX", "Baltimore MD", "Boston MA", "Charlotte NC",
        "Chicago IL", "Cleveland OH", "Columbus OH", "Dallas TX", "Denver CO", "Detroit MI",
        "El Paso TX", "Fort Worth TX", "Houston TX", "Indianapolis IN", "Jacksonville FL",
        "Kansas City MO", "Las Vegas NV", "Los Angeles CA", "Louisville KY", "Memphis TN",
        "Miami FL", "Milwaukee WI", "Minneapolis MN", "Nashville TN", "New Orleans LA",
        "New York NY", "Oklahoma City OK", "Omaha NE", "Philadelphia PA", "Phoenix AZ",
        "Portland OR", "Raleigh NC", "Sacramento CA", "Salt Lake City UT", "San Antonio TX",
        "San Diego CA", "San Francisco CA", "San Jose CA", "Seattle WA", "St. Louis MO",
        "Tampa FL", "Tucson AZ", "Tulsa OK", "Virginia Beach VA", "Washington DC"
    ];
    
    const AGENT_STATES = [...INVESTOR_STATES];
    const CASH_BUYERS = [...INVESTOR_STATES];
    
    const COMMERCIAL = [
        "Office Buildings", "Retail Spaces", "Industrial Warehouses", "Multi-Family Apartments",
        "Mixed-Use Properties", "Hotels & Hospitality", "Medical Offices", "Self-Storage Facilities",
        "Land & Development", "Data Centers", "Senior Living", "Student Housing"
    ];
    
    function populateGrid(elementId, items, typePrefix, icon = '📍') {
        const container = document.getElementById(elementId);
        if (!container) return;
        
        container.innerHTML = '';
        
        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'list-item';
            div.innerHTML = `${icon} ${item}`;
            div.addEventListener('click', (e) => {
                e.stopPropagation();
                showNotification(`✨ Loading ${typePrefix} for ${item}...`, 'info');
                // Simulate loading - in production, redirect to leads page
                console.log(`Selected: ${typePrefix} - ${item}`);
            });
            container.appendChild(div);
        });
    }
    
    function initFilter() {
        const filterInput = document.getElementById('filterSearch');
        if (!filterInput) return;
        
        const performFilter = () => {
            const searchTerm = filterInput.value.toLowerCase().trim();
            const items = document.querySelectorAll('.list-item');
            let visibleCount = 0;
            let totalCount = items.length;
            
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (searchTerm === '' || text.includes(searchTerm)) {
                    item.style.display = 'flex';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Update category counts
            const categories = document.querySelectorAll('.list-category');
            categories.forEach(category => {
                const categoryItems = category.querySelectorAll('.list-item');
                const visibleInCategory = Array.from(categoryItems).filter(item => item.style.display !== 'none').length;
                const totalInCategory = categoryItems.length;
                const countSpan = category.querySelector('.category-count');
                
                if (countSpan) {
                    if (searchTerm !== '') {
                        countSpan.textContent = `${visibleInCategory} / ${totalInCategory} shown`;
                    } else {
                        countSpan.textContent = `${totalInCategory} ${totalInCategory === 1 ? 'item' : 'items'}`;
                    }
                }
            });
        };
        
        filterInput.addEventListener('input', performFilter);
        
        // Handle search param from main page
        const searchQuery = sessionStorage.getItem('searchQuery');
        if (searchQuery) {
            filterInput.value = searchQuery;
            performFilter();
            sessionStorage.removeItem('searchQuery');
            showNotification(`🔍 Showing results for: "${searchQuery}"`, 'info');
        }
    }
    
    function initCollapsible() {
        const categories = document.querySelectorAll('.list-category');
        
        categories.forEach((category, index) => {
            const header = category.querySelector('.category-header');
            if (!header) return;
            
            header.addEventListener('click', () => {
                // Close others? Optional - uncomment if desired
                // categories.forEach(c => {
                //     if (c !== category) c.classList.remove('open');
                // });
                category.classList.toggle('open');
            });
            
            // Open first category by default
            if (index === 0) {
                category.classList.add('open');
            }
        });
    }
    
    function showNotification(message, type) {
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span>${message}</span>
                <button class="toast-close">×</button>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => toast.remove());
        }
        
        setTimeout(() => {
            if (toast && toast.parentNode) toast.remove();
        }, 4000);
    }
    
    // Initialize everything when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        populateGrid('investorStatesGrid', INVESTOR_STATES, 'Investor List', '💰');
        populateGrid('investorCitiesGrid', INVESTOR_CITIES, 'Investor City List', '🏙️');
        populateGrid('agentStatesGrid', AGENT_STATES, 'Residential Agents', '🏠');
        populateGrid('cashBuyersGrid', CASH_BUYERS, 'Cash Buyers', '💵');
        populateGrid('commercialGrid', COMMERCIAL, 'Commercial Real Estate', '🏢');
        
        initFilter();
        initCollapsible();
    }
})();