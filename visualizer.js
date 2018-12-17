/**
 * HTML Audio Visualizer
 * =======================
 * Renders a visulizer based on a music stream
 * =======================
 * @author Denis Zholob
 * @repository 
*/

// Constants
const streamURL = 'http://stream.dancewave.online:8080/dance.mp3';
const error_AudioApi = 'Web Audio API is not supported in this browser';

// Variables
let audioContext;
let streamBuffer = null;

// Elements
let el_audioStream;
let el_audioCanvas;

// Events
window.addEventListener('load', init, false);

// Functions

/**
 * Init the audio context
 */
function init() {
    document.getElementById('musicUrl').href = streamURL;
    document.getElementById('musicUrl').text = streamURL;
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();
    }
    catch (e) {
        console.error(error_AudioApi)
        alert(error_AudioApi);
    }

    el_audioStream = document.getElementById("audioStream");
    el_audioCanvas = document.getElementById("audioCanvas");
    loadStream(el_audioStream, streamURL);
    drawVisualizer(el_audioCanvas, el_audioStream);
}

/**
 * Fix blurriness due to wrong canvas sizing
 * @param {HTMLCanvasElement} canvasElement 
 */
function fixCanvasDPI(canvasElement) {
    //get DPI
    let dpi = window.devicePixelRatio;
    //get CSS height
    //the + prefix casts it to an integer
    //the slice method gets rid of "px"
    let style_height = +getComputedStyle(canvasElement).getPropertyValue("height").slice(0, -2);
    //get CSS width
    let style_width = +getComputedStyle(canvasElement).getPropertyValue("width").slice(0, -2);
    //scale the canvas
    canvasElement.setAttribute('height', style_height * dpi);
    canvasElement.setAttribute('width', style_width * dpi);
}

/**
 * 
 * @param {HTMLCanvasElement} canvasElement 
 * @param {HTMLAudioElement} audioElement 
 */
function drawVisualizer(canvasElement, audioElement) {
    let src = audioContext.createMediaElementSource(audioElement);
    let analyserNode = audioContext.createAnalyser();

    src.connect(analyserNode);
    analyserNode.connect(audioContext.destination); // connect the source to the context's destination (the speakers)

    // Analyser Options (https://webaudio.github.io/web-audio-api/#dictdef-analyseroptions)
    analyserNode.fftSize = VISUALIZER_SETTINGS.analyzerOptions.samples;
    analyserNode.minDecibels = VISUALIZER_SETTINGS.analyzerOptions.minDecibels; // Bottom Clipping in db
    analyserNode.maxDecibels = VISUALIZER_SETTINGS.analyzerOptions.maxDecibels; // Top Clipping in db

    audioElement.play();
    renderVisualizerFrame(analyserNode, canvasElement);
}

/**
 * Renders an animation Frame for the visualizer
 * Draws visualzer bars based on the frequency analyzer, and settings
 * @param {AnalyserNode} analyserNode 
 * @param {HTMLCanvasElement} canvasElement 
 */
function renderVisualizerFrame(analyserNode, canvasElement) {
    fixCanvasDPI(canvasElement);
    let canvasBrush = canvasElement.getContext("2d");
    let WIDTH = canvasElement.width;
    let HEIGHT = canvasElement.height;
    let dataArray = new Uint8Array(analyserNode.frequencyBinCount);

    analyserNode.getByteFrequencyData(dataArray);

    // === BG === //
    canvasBrush.fillStyle = VISUALIZER_SETTINGS.style.bgcolor;
    canvasBrush.fillRect(0, 0, WIDTH, HEIGHT);

    // === Visualizer Bars === //

    // Bar color (gradient)
    const BAR_GRAD = canvasBrush.createLinearGradient(0, 0, 0, HEIGHT);
    BAR_GRAD.addColorStop(0, VISUALIZER_SETTINGS.style.barColor1);
    BAR_GRAD.addColorStop(1, VISUALIZER_SETTINGS.style.barColor2);

    // Bar style
    const BAR_FILL = VISUALIZER_SETTINGS.style.barGradient ? BAR_GRAD : VISUALIZER_SETTINGS.style.barColor1;
    const BAR_COUNT = dataArray.length;
    const BAR_SPACING = VISUALIZER_SETTINGS.style.barSpacing;
    const BAR_WIDTH = VISUALIZER_SETTINGS.style.barSpaceWrap ?
        (WIDTH - (BAR_COUNT+1) * BAR_SPACING) / BAR_COUNT:
        (WIDTH - (BAR_COUNT-1) * BAR_SPACING) / BAR_COUNT;

    let barPosX = VISUALIZER_SETTINGS.style.barSpaceWrap ? BAR_SPACING : 0;
    // Loop through each frequency to generate bars
    dataArray.forEach((val) => {
        barHeight = freqDatToHeight(val, HEIGHT) || 1;
        canvasBrush.fillStyle = BAR_FILL;
        canvasBrush.fillRect(barPosX, HEIGHT - barHeight, BAR_WIDTH, barHeight);
        barPosX += BAR_WIDTH + BAR_SPACING;
    })

    // Request the browser to render a new frame (https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations)
    window.requestAnimationFrame(() => renderVisualizerFrame(analyserNode, canvasElement));
}


/**
 * Loads a string into a letiable
 * @param {HTMLAudioElement} audioElement 
 * @param {string} url 
 */
function loadStream(audioElement, url) {
    audioElement.crossOrigin = "anonymous";
    audioElement.src = url;
    audioElement.load();
    audioElement.play();
}


// === Utility Functions == //

/**
 * Convert Frequency datapoint to a height
 * Freq values are from 0-255
 * @param {Number} dataPoint 
 * @param {Number} maxCanvasHeight 
 */
function freqDatToHeight(dataPoint, maxCanvasHeight) {
    return ratioConvert(dataPoint, 0, 255, 1, maxCanvasHeight);
}

/**
 * Simple ratio convertion function
 * @param {Number} valIn 
 * @param {Number} minIn 
 * @param {Number} maxIn 
 * @param {Number} minOut 
 * @param {Number} maxOut 
 */
function ratioConvert(valIn, minIn, maxIn, minOut, maxOut) {
    return Math.round((maxOut - minOut) / (maxIn - minIn) * valIn);
}
