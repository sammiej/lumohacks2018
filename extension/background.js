'use strict';

chrome.runtime.onInstalled.addListener(function() {

  // Limit which domains extensions will be active for
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'www.google.ca', schemes: ['https']} //TODO: allow all domains later
      })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});
