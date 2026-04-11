function setStatus(text) {
    browser.storage.session.set({ status: text });
}

browser.runtime.onMessage.addListener((message, sender) => {
    // Message from injection script — forward status and persist it
    if (message.status) {
        setStatus(message.status);
        if (message.status === "Download complete!") {
            setTimeout(() => setStatus(""), 2000);
        }
    }
});

browser.runtime.onMessage.addListener((message, sender) => {
    // Message from popup requesting script injection
    if (message.action === "download") {
        setStatus("Starting download...");
        browser.scripting.executeScript({
            target: { tabId: message.tabId },
            files: ["injection-script/script.js"]
        }).catch(() => setStatus("Error: could not run script."));
    }
});
