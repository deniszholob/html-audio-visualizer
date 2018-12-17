/**
 * HTML Audio Visualizer Settings
 * =======================
 * Settings for the audio visualizer
 * Note: import before the visualizer.js file
 * =======================
 * @author Denis Zholob
 * @repository 
*/

// Some initial colors
const COLORS = {
    black: '#000000',
    white: '#ffffff',
    cyan: '#00ABEB',
    greenAcid: '#A8EB12',
    pink: '#CB0ED9',
}

// Settings for the visualizer
const VISUALIZER_SETTINGS = {
    analyzerOptions: {
        samples: 32, // Number of bars
        minDecibels: -120, // Bottom Clipping in db
        maxDecibels: -20, // Top Clipping in db
    },
    style: {
        bgcolor: COLORS.black,
        barGradient: true,
        barColor1: COLORS.cyan,
        barColor2: COLORS.greenAcid,
        barSpacing: 10, // In px
        barSpaceWrap: true,
    }
}


// Functions

function setBgColor(color){
    VISUALIZER_SETTINGS.style.bgcolor = color;
};
function setBarColor1(color){
    VISUALIZER_SETTINGS.style.barColor1 = color;
};
function setBarColor2(color){
    VISUALIZER_SETTINGS.style.barColor2 = color;
};
function setBarSpacing(barSpacing){
    VISUALIZER_SETTINGS.style.barSpacing = barSpacing;
}
function doBarSpaceWrap(){
    VISUALIZER_SETTINGS.style.barSpaceWrap = !VISUALIZER_SETTINGS.style.barSpaceWrap;
}

function init() {
    // Elements
    const el_clr_bg = document.getElementById("clr_bg");
    const el_clr_bar1 = document.getElementById("clr_bar1");
    const el_clr_bar2 = document.getElementById("clr_bar2");
    const el_txt_spacing = document.getElementById("txt_spacing");
    const el_bool_spaceWrap = document.getElementById("bool_spaceWrap");

    el_clr_bg.value = VISUALIZER_SETTINGS.style.bgcolor;
    el_clr_bar1.value = VISUALIZER_SETTINGS.style.barColor1;
    el_clr_bar2.value = VISUALIZER_SETTINGS.style.barColor2;
    el_txt_spacing.value = VISUALIZER_SETTINGS.style.barSpacing;
    el_bool_spaceWrap.checked = VISUALIZER_SETTINGS.style.barSpaceWrap;
}


// Events
window.addEventListener('load', init, false);
