(function() {
    const storage = chrome.storage;

    // Check if hiding fandom results is enabled.
    storage.local.get(['isDisabled', 'hideFandomFextralife'], (result) => {
        if (result && result.isDisabled !== true && result.hideFandomFextralife) {
            // If hiding fandom results is enabled, grab all the links going to the old fandom sites
            const fandomLinks = document.querySelectorAll('[href*="pathofexile.fandom"]');
            const fextralifeLinks = document.querySelectorAll('[href*="pathofexile2.wiki.fextralife"]');

            // recursively go up through tree until getting relevant div to remove
            function getParent(element, maxDepth = 10) {
                if (element.parentElement) {
                    if (element.classList.contains('g')) {
                        // Add an element in place of the removed search result signifying a result was removed.
                        var removedElement = document.createElement("span");
                        removedElement.classList.add("st");
                        removedElement.innerHTML = "PoE Fandom/Fextralife result removed by PoE Wiki Redirector."
                        removedElement.style.paddingBottom = "1em";
                        removedElement.style.display = "inline-block";
                        element.parentNode.insertBefore(removedElement, element);
                        //remove the element.
                        element.remove();
                    } else {
                        // Keep going up the elements until the necessary element is found.
                        getParent(element.parentElement, maxDepth - 1);
                    }
                }
            }

            // Go through and process each fandom or fextralife link, removing their result from the search results
            fandomLinks.forEach((e) => getParent(e));
            fextralifeLinks.forEach((e) => getParent(e));
        }
    });
})();
