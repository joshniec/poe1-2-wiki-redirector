(function() {
    let storage = chrome.storage;
    let stateImage = document.getElementById("addonStateImage");

    if (stateImage === null) {
        console.error("Something went wrong!");
        return;
    }

    function toggle() {
        let prom = storage.local.set({
            isDisabled: !currentState
        });
        update();
    }
    stateImage.addEventListener("click", toggle)
    let stateDesc = document.getElementById("addonStateDescriptor");
    if (stateDesc === null) {
        console.error("Something went wrong!");
        return;
    }

    const hideFandomFextralifeCheck = document.querySelector("#hideFandomFextralifeCheck")
    hideFandomFextralifeCheck.addEventListener("click", (e) => {
        storage.local.set({
            hideFandomFextralife: e.target.checked
        });
    });

    window.update = function() {
        storage.local.get(['isDisabled', 'hideFandomFextralife'], function(result) {
            if (result === undefined) {
                result = {
                    isDisabled: false,
                    hideFandomFextralife: true
                };
            }
            window.currentState = result.isDisabled === true;
            stateImage.style.backgroundImage = "url('powerbutton_" + (result.isDisabled ? "off" : "on") + ".png')";
            stateDesc.innerHTML = result.isDisabled ? "disabled" : "enabled";
            stateDesc.style.color = result.isDisabled ? "#7C1D1D" : "#217A3D";
            hideFandomFextralifeCheck.checked = result.hideFandomFextralife;
        });
    }
    update();
})();
