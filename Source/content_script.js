function walk(rootNode)
{
    // Find all the text nodes in rootNode
    var walker = document.createTreeWalker(
        rootNode,
        NodeFilter.SHOW_TEXT,
        null,
        false
    ),
    node;

    // Modify each text node's value
    while (node = walker.nextNode()) {
        handleText(node);
    }
}

function handleText(textNode) {
  textNode.nodeValue = replaceText(textNode.nodeValue);
}

function replaceText(v)
{
    // Millennial
    v = v.replace(/\bChina\b/g, "West-Taiwan");
    v = v.replace(/\bchina\b/g, "West-Taiwan");
    v = v.replace(/\bKina\b/g, "Väst-Taiwan");
    v = v.replace(/\bkina\b/g, "Väst-Taiwan");

    v = v.replace(/\bChinese\b/g, "West-Taiwanese");
    v = v.replace(/\bchinese\b/g, "West-Taiwanese");
    v = v.replace(/\bKinesiska\b/g, "Väst-Taiwanska");
    v = v.replace(/\bkinesiska\b/g, "Väst-Taiwanska");

    v = v.replace(/\bKinesisk\b/g, "Väst-Taiwanska");
    v = v.replace(/\bkinesisk\b/g, "Väst-Taiwanska");

    v = v.replace(/\bChina's\b/g, "West-Taiwan's");
    v = v.replace(/\bchina's\b/g, "West-Taiwan's");
    v = v.replace(/\bKinas\b/g, "Väst-Taiwans");
    v = v.replace(/\bkinas\b/g, "Väst-Taiwans");

    v = v.replace(/\bChinas\b/g, "West-Taiwan's");
    v = v.replace(/\bchinas\b/g, "West-Taiwan's");

    v = v.replace(/\bKineser\b/g, "Väst-Taiwaneser");
    v = v.replace(/\bkineser\b/g, "Väst-Taiwaneser");


    v = v.replace(/\bRussia\b/g, "East-Ukraine");
    v = v.replace(/\brussia\b/g, "East-Ukraine");
    v = v.replace(/\bRyssland\b/g, "Öst-Ukraina");
    v = v.replace(/\bryssland\b/g, "Öst-Ukraina");

    v = v.replace(/\bryska\b/g, "Öst-Ukrainska");
    v = v.replace(/\bRyska\b/g, "Öst-Ukrainska");
    v = v.replace(/\bRussian\b/g, "East-Ukrainian");
    v = v.replace(/\brussian\b/g, "East-Ukrainian");

    v = v.replace(/\bRysk\b/g, "Öst-Ukrainsk");
    v = v.replace(/\brysk\b/g, "Öst-Ukrainsk");

    v = v.replace(/\brysslands\b/g, "Öst-Ukrainas");
    v = v.replace(/\bRysslands\b/g, "Öst-Ukrainas");
    v = v.replace(/\bRussia's\b/g, "East-Ukraine's");
    v = v.replace(/\brussia's\b/g, "East-Ukraine's");

    v = v.replace(/\bRussias\b/g, "East-Ukraine's");
    v = v.replace(/\brussias\b/g, "East-Ukraine's");

    v = v.replace(/\bryssar\b/g, "Öst-Ukrainer");
    v = v.replace(/\bRyssar\b/g, "Öst-Ukrainer");
    v = v.replace(/\bRussians\b/g, "East-Ukrainians");
    v = v.replace(/\brussians\b/g, "East-Ukrainians");

    return v;
}

// Returns true if a node should *not* be altered in any way
function isForbiddenNode(node) {
    return node.isContentEditable || // DraftJS and many others
    (node.parentNode && node.parentNode.isContentEditable) || // Special case for Gmail
    (node.tagName && (node.tagName.toLowerCase() == "textarea" || // Some catch-alls
                     node.tagName.toLowerCase() == "input"));
}

// The callback used for the document body and title observers
function observerCallback(mutations) {
    var i, node;

    mutations.forEach(function(mutation) {
        for (i = 0; i < mutation.addedNodes.length; i++) {
            node = mutation.addedNodes[i];
            if (isForbiddenNode(node)) {
                // Should never operate on user-editable content
                continue;
            } else if (node.nodeType === 3) {
                // Replace the text for text nodes
                handleText(node);
            } else {
                // Otherwise, find text nodes within the given node and replace text
                walk(node);
            }
        }
    });
}

// Walk the doc (document) body, replace the title, and observe the body and title
function walkAndObserve(doc) {
    var docTitle = doc.getElementsByTagName('title')[0],
    observerConfig = {
        characterData: true,
        childList: true,
        subtree: true
    },
    bodyObserver, titleObserver;

    // Do the initial text replacements in the document body and title
    walk(doc.body);
    doc.title = replaceText(doc.title);

    // Observe the body so that we replace text in any added/modified nodes
    bodyObserver = new MutationObserver(observerCallback);
    bodyObserver.observe(doc.body, observerConfig);

    // Observe the title so we can handle any modifications there
    if (docTitle) {
        titleObserver = new MutationObserver(observerCallback);
        titleObserver.observe(docTitle, observerConfig);
    }
}
walkAndObserve(document);
