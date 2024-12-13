// Simple extension to redirect all requests from PoE Fandom, FextraLife to PoE1/2 Wiki respectively
(function() {
    'use strict';
    let isPluginDisabled = false; // Variable storing whether or not the plugin is disabled.
    let storage = chrome.storage; // Make sure we have a storage API.

    const POE_FANDOM_REGEX = /^(pathofexile)\.(fandom)\.com$/i; // Used to match the domain of the old fandom to make sure we are redirecting the correct domain.
    const POE_FEXTRALIFE_REGEX = /^(pathofexile2)\.(wiki)\.(fextralife)\.com$/i; // Used to match the domain of the old fextralife to make sure we are redirecting the correct domain.

    // Listen to before anytime the browser attempts to navigate to the old Fandom site.
    chrome.webNavigation.onBeforeNavigate.addListener(
        function(info) {
            if (isPluginDisabled) { // Ignore all navigation requests when the extension is disabled.
                console.log("PoE Fandom or FextraLife intercepted, ignoring because plugin is disabled.");
                return;
            }

            // Create a native URL object to more easily determine the path of the url and the domain.
            const url = new URL(info.url);


            const isFandom = POE_FANDOM_REGEX.test(url.host); // Check to ensure the redirect is occurring on the fandom domain.
            const isFextraLife = POE_FEXTRALIFE_REGEX.test(url.host); // Check to ensure the redirect is occurring on the fextralife domain.

            // If domain isn't subdomain of fandom.com or fextralife.com, ignore, also if it's not in the redirect filter
            if (!isFandom || !isFextraLife) return;

            // Generate new url
            const oldHost = url.host.split('.')[0].toLowerCase();
            let newHost = null;

            switch (oldHost) {
                case 'pathofexile':
                    newHost = 'poewiki.net';
                    break;
                case 'pathofexile2':
                    newHost = 'poe2wiki.net';
                    break;
                default:
                    break;
            };

            if (!newHost) return;

            const redirectUrl = `https://${newHost}${url.pathname.replace(/^\/wiki\//i,"/wiki/")}`; // Create the redirect URL
            console.log(`PoE Fandom or Fextralife intercepted:  ${info.url}\nRedirecting to ${redirectUrl}`);
            // Redirect the old request to new wiki
            chrome.tabs.update(info.tabId, {
                url: redirectUrl
            });
        });

    function updateIcon() {
        // Change the icon to match the state of the plugin.
        chrome.action.setIcon({
            path: isPluginDisabled ? "icon48.png" : "icon48.png"
        });
    }

    storage.local.get(['isDisabled'], (result) => {
        // Get the initial condition of whether or not the extension is disabled
        isPluginDisabled = result ? result.isDisabled : false;
        updateIcon(); // Update icon to match new state
    });

    // Anytime the state of the plugin changes, update the internal state of the background script.
    storage.onChanged.addListener(
        function(changes, areaName) {
            // If isDisabled changed, update isPluginDisabled
            if (changes["isDisabled"] !== undefined && changes["isDisabled"].newValue != changes["isDisabled"].oldValue) {
                console.log(`PoE1 & 2 Wiki Redirector is now ${changes["isDisabled"].newValue?'disabled':'enabled'}`);
                isPluginDisabled = changes["isDisabled"].newValue;
                updateIcon();
            }
        }
    );
})();
