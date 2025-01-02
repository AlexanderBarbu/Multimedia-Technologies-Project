
// Events
// init() once the page has finished loading.
// init() once the page has finished loading.
window.onload = init;

var timerWorker = null; // Worker thread to send us scheduling messages.
var context;
var convolver;
var compressor;
var masterGainNode;
var effectLevelNode;
var filterNode;

// Each effect impulse response has a specific overall desired dry and wet volume.
// For example in the telephone filter, it's necessary to make the dry volume 0 to correctly hear the effect.
var effectDryMix = 1.0;
var effectWetMix = 1.0;

var timeoutId;

var startTime;
var lastDrawTime = -1;

var kits;

var kNumInstruments = 6;
var kInitialKitIndex = 10;
var kMaxSwing = .08;

var currentKit;

var rhythm4_1 = Array(4).fill(0);var rhythm4_2 = Array(4).fill(0);
var rhythm4_3 = Array(4).fill(0);var rhythm4_4 = Array(4).fill(0);
var rhythm4_5 = Array(4).fill(0);var rhythm4_6 = Array(4).fill(0);
var rhythm_4s = [rhythm4_1,rhythm4_2,rhythm4_3,rhythm4_4,rhythm4_5,rhythm4_6];
var rhythm8_1 = Array(8).fill(0);var rhythm8_2 = Array(8).fill(0);
var rhythm8_3 = Array(8).fill(0);var rhythm8_4 = Array(8).fill(0);
var rhythm8_5 = Array(8).fill(0);var rhythm8_6 = Array(8).fill(0);
var rhythm_8s = [rhythm8_1,rhythm8_2,rhythm8_3,rhythm8_4,rhythm8_5,rhythm8_6];
var rhythm12_1 = Array(12).fill(0);var rhythm12_2 = Array(12).fill(0);
var rhythm12_3 = Array(12).fill(0);var rhythm12_4 = Array(12).fill(0);
var rhythm12_5 = Array(12).fill(0);var rhythm12_6 = Array(12).fill(0);
var rhythm_12s = [rhythm12_1,rhythm12_2,rhythm12_3,rhythm12_4,rhythm12_5,rhythm12_6];
var rhythm16_1 = Array(16).fill(0);var rhythm16_2 = Array(16).fill(0);
var rhythm16_3 = Array(16).fill(0);var rhythm16_4 = Array(16).fill(0);
var rhythm16_5 = Array(16).fill(0);var rhythm16_6 = Array(16).fill(0);
var rhythm_16s = [rhythm16_1,rhythm16_2,rhythm16_3,rhythm16_4,rhythm16_5,rhythm16_6];
var rhythm20_1 = Array(20).fill(0);var rhythm20_2 = Array(20).fill(0);
var rhythm20_3 = Array(20).fill(0);var rhythm20_4 = Array(20).fill(0);
var rhythm20_5 = Array(20).fill(0);var rhythm20_6 = Array(20).fill(0);
var rhythm_20s = [rhythm20_1,rhythm20_2,rhythm20_3,rhythm20_4,rhythm20_5,rhythm20_6];
var rhythm24_1 = Array(24).fill(0);var rhythm24_2 = Array(24).fill(0);
var rhythm24_3 = Array(24).fill(0);var rhythm24_4 = Array(24).fill(0);
var rhythm24_5 = Array(24).fill(0);var rhythm24_6 = Array(24).fill(0);
var rhythm_24s = [rhythm24_1,rhythm24_2,rhythm24_3,rhythm24_4,rhythm24_5,rhythm24_6];
var rhythm28_1 = Array(28).fill(0);var rhythm28_2 = Array(28).fill(0);
var rhythm28_3 = Array(28).fill(0);var rhythm28_4 = Array(28).fill(0);
var rhythm28_5 = Array(28).fill(0);var rhythm28_6 = Array(28).fill(0);
var rhythm_28s = [rhythm28_1,rhythm28_2,rhythm28_3,rhythm28_4,rhythm28_5,rhythm28_6];
var rhythm32_1 = Array(32).fill(0);var rhythm32_2 = Array(32).fill(0);
var rhythm32_3 = Array(32).fill(0);var rhythm32_4 = Array(32).fill(0);
var rhythm32_5 = Array(32).fill(0);var rhythm32_6 = Array(32).fill(0);
rhythm_32s = [rhythm32_1,rhythm32_2,rhythm32_3,rhythm32_4,rhythm32_5,rhythm32_6];
var rhythm1 = rhythm16_1 
var rhythm2 = rhythm16_2 
var rhythm3 = rhythm16_3 
var rhythm4 = rhythm16_4 
var rhythm5 = rhythm16_5 
var rhythm6 = rhythm16_6


function hide(prev){
    pad = document.getElementById("pad");
    pad.classList.toggle('Four', false);
    pad.classList.toggle('Eight', false);
    pad.classList.toggle('Twelve', false);
    pad.classList.toggle('Sixteen', false);
    pad.classList.toggle('Twenty', false);
    pad.classList.toggle('Twentyfour', false);
    pad.classList.toggle('Twentyeight', false);
    pad.classList.toggle('Thirtytwo', false);
    
    if (loopLength==4){pad.classList.toggle('Four', true);}
    else if (loopLength==8){pad.classList.toggle('Eight', true);}
    else if (loopLength==12){pad.classList.toggle('Twelve', true);}
    else if (loopLength==16){pad.classList.toggle('Sixteen', true);}
    else if (loopLength==20){pad.classList.toggle('Twenty', true);}
    else if (loopLength==24){pad.classList.toggle('Twentyfour', true);}
    else if (loopLength==28){pad.classList.toggle('Twentyeight', true);}
    else if (loopLength==32){pad.classList.toggle('Thirtytwo', true);}
    
    if (prev > loopLength) {
        for (let i = prev - 1; i > loopLength - 1; i--) {
            document.getElementById("Tom1_" + i).toggleAttribute("hidden");
            document.getElementById("Tom2_" + i).toggleAttribute("hidden");
            document.getElementById("Tom3_" + i).toggleAttribute("hidden");
            document.getElementById("HiHat_" + i).toggleAttribute("hidden");
            document.getElementById("Snare_" + i).toggleAttribute("hidden");
            document.getElementById("Kick_" + i).toggleAttribute("hidden");
            document.getElementById("LED_" + i).toggleAttribute("hidden");
        }
    }
    else if (prev < loopLength) {
        for (let i = prev; i < loopLength; i++) {
            document.getElementById("Tom1_" + i).toggleAttribute("hidden");
            document.getElementById("Tom2_" + i).toggleAttribute("hidden");
            document.getElementById("Tom3_" + i).toggleAttribute("hidden");
            document.getElementById("HiHat_" + i).toggleAttribute("hidden");
            document.getElementById("Snare_" + i).toggleAttribute("hidden");
            document.getElementById("Kick_" + i).toggleAttribute("hidden");
            document.getElementById("LED_" + i).toggleAttribute("hidden");
        }
    }
}

function getRhythm(number){
    if (loopLength == 4) {return rhythm_4s[number - 1]}
    if (loopLength == 8) {return rhythm_8s[number - 1]}
    if (loopLength == 12) {return rhythm_12s[number - 1]}
    if (loopLength == 16) {return rhythm_16s[number - 1]}
    if (loopLength == 20) {return rhythm_20s[number - 1]}
    if (loopLength == 24) {return rhythm_24s[number - 1]}
    if (loopLength == 28) {return rhythm_28s[number - 1]}
    if (loopLength == 32) {return rhythm_32s[number - 1]}
}

var beatReset = {"kitIndex":0,"effectIndex":0,"tempo":100,"swingFactor":0,"effectMix":0.25,"kickPitchVal":0.5,"snarePitchVal":0.5,"hihatPitchVal":0.5,"tom1PitchVal":0.5,"tom2PitchVal":0.5,"tom3PitchVal":0.5,"rhythm1":rhythm1,"rhythm2":rhythm2,"rhythm3":rhythm3,"rhythm4":rhythm4,"rhythm5":rhythm5,"rhythm6":rhythm6};
var beatDemo = [
    {"kitIndex":13,"effectIndex":18,"tempo":120,"swingFactor":0,"effectMix":0.19718309859154926,"kickPitchVal":0.5,"snarePitchVal":0.5,"hihatPitchVal":0.5,"tom1PitchVal":0.5,"tom2PitchVal":0.5,"tom3PitchVal":0.5,"rhythm1":[2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm2":[0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0],"rhythm3":[0,0,0,0,0,0,2,0,2,0,0,0,0,0,0,0],"rhythm4":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0],"rhythm5":[0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm6":[0,0,0,0,0,0,0,2,0,2,2,0,0,0,0,0]},
    {"kitIndex":4,"effectIndex":12,"tempo":100,"swingFactor":0,"effectMix":0.2,"kickPitchVal":0.46478873239436624,"snarePitchVal":0.45070422535211263,"hihatPitchVal":0.15492957746478875,"tom1PitchVal":0.7183098591549295,"tom2PitchVal":0.704225352112676,"tom3PitchVal":0.8028169014084507,"rhythm1":[2,1,0,0,0,0,0,0,2,1,2,1,0,0,0,0],"rhythm2":[0,0,0,0,2,0,0,0,0,1,1,0,2,0,0,0],"rhythm3":[0,1,2,1,0,1,2,1,0,1,2,1,0,1,2,1],"rhythm4":[0,0,0,0,0,0,2,1,0,0,0,0,0,0,0,0],"rhythm5":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0],"rhythm6":[0,0,0,0,0,0,0,2,1,2,1,0,0,0,0,0]},
    {"kitIndex":2,"effectIndex":5,"tempo":100,"swingFactor":0,"effectMix":0.25,"kickPitchVal":0.5,"snarePitchVal":0.5,"hihatPitchVal":0.5211267605633803,"tom1PitchVal":0.23943661971830987,"tom2PitchVal":0.21126760563380287,"tom3PitchVal":0.2535211267605634,"rhythm1":[2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0],"rhythm2":[0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0],"rhythm3":[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],"rhythm4":[1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1],"rhythm5":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0],"rhythm6":[0,0,1,0,1,0,0,2,0,2,0,0,1,0,0,0]},
    {"kitIndex":1,"effectIndex":6,"tempo":120,"swingFactor":0,"effectMix":0.25,"kickPitchVal":0.7887323943661972,"snarePitchVal":0.49295774647887325,"hihatPitchVal":0.5,"tom1PitchVal":0.323943661971831,"tom2PitchVal":0.3943661971830986,"tom3PitchVal":0.323943661971831,"rhythm1":[2,0,0,0,0,0,0,2,2,0,0,0,0,0,0,1],"rhythm2":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm3":[0,0,1,0,2,0,1,0,1,0,1,0,2,0,2,0],"rhythm4":[2,0,2,0,0,0,0,0,2,0,0,0,0,2,0,0],"rhythm5":[0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm6":[0,2,0,0,0,2,0,0,0,2,0,0,0,0,0,0]},
    {"kitIndex":0,"effectIndex":1,"tempo":60,"swingFactor":0.5419847328244275,"effectMix":0.25,"kickPitchVal":0.5,"snarePitchVal":0.5,"hihatPitchVal":0.5,"tom1PitchVal":0.5,"tom2PitchVal":0.5,"tom3PitchVal":0.5,"rhythm1":[2,2,0,1,2,2,0,1,2,2,0,1,2,2,0,1],"rhythm2":[0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0],"rhythm3":[2,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1],"rhythm4":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm5":[0,0,1,0,0,1,0,1,0,0,1,0,0,0,1,0],"rhythm6":[1,0,0,1,0,1,0,1,1,0,0,1,1,1,1,0]},
];

function cloneBeat(source) {
    var beat = new Object();

    beat.kitIndex = source.kitIndex;
    beat.effectIndex = source.effectIndex;
    beat.tempo = source.tempo;
    beat.swingFactor = source.swingFactor;
    beat.effectMix = source.effectMix;
    beat.kickPitchVal = source.kickPitchVal;
    beat.snarePitchVal = source.snarePitchVal;
    beat.hihatPitchVal = source.hihatPitchVal;
    beat.tom1PitchVal = source.tom1PitchVal;
    beat.tom2PitchVal = source.tom2PitchVal;
    beat.tom3PitchVal = source.tom3PitchVal;
    beat.rhythm1 = rhythm1;        // slice(0) is an easy way to copy the full array
    beat.rhythm2 = rhythm2;
    beat.rhythm3 = rhythm3;
    beat.rhythm4 = rhythm4;
    beat.rhythm5 = rhythm5;
    beat.rhythm6 = rhythm6;

    return beat;
}

// theBeat is the object representing the current beat/groove
// ... it is saved/loaded via JSON
var theBeat = cloneBeat(beatReset);

kickPitch = snarePitch = hihatPitch = tom1Pitch = tom2Pitch = tom3Pitch = 0;

var mouseCapture = null;
var mouseCaptureOffset = 0;

var loopLength = 16;
var rhythmIndex = 0;
var kMinTempo = 53;
var kMaxTempo = 180;
var noteTime = 0.0;

var instruments = ['Kick', 'Snare', 'HiHat', 'Tom1', 'Tom2', 'Tom3'];

var volumes = [0, 0.3, 1];

var kitCount = 0;

var kitName = [
    "R8",
    "CR78",
    "KPR77",
    "LINN",
    "Kit3",
    "Kit8",
    "Techno",
    "Stark",
    "breakbeat8",
    "breakbeat9",
    "breakbeat13",
    "acoustic-kit",
    "4OP-FM",
    "TheCheebacabra1",
    "TheCheebacabra2"
];

var kitNamePretty = [
    "Roland R-8",
    "Roland CR-78",
    "Korg KPR-77",
    "LinnDrum",
    "Kit 3",
    "Kit 8",
    "Techno",
    "Stark",
    "Breakbeat 8",
    "Breakbeat 9",
    "Breakbeat 13",
    "Acoustic Kit",
    "4OP-FM",
    "The Cheebacabra 1",
    "The Cheebacabra 2"
];

var loopOptions = [4,8,12,16,20,24,28,32]

function Kit(name) {
    this.name = name;

    this.pathName = function() {
        var pathName = "sounds/drum-samples/" + this.name + "/";
        return pathName;
    };

    this.kickBuffer = 0;
    this.snareBuffer = 0;
    this.hihatBuffer = 0;

    this.instrumentCount = kNumInstruments;
    this.instrumentLoadCount = 0;

    this.startedLoading = false;
    this.isLoaded = false;

    this.demoIndex = -1;
}

Kit.prototype.setDemoIndex = function(index) {
    this.demoIndex = index;
}

Kit.prototype.load = function() {
    if (this.startedLoading)
        return;

    this.startedLoading = true;
    var pathName = this.pathName();

    var kickPath = pathName + "kick.wav";
    var snarePath = pathName + "snare.wav";
    var hihatPath = pathName + "hihat.wav";
    var tom1Path = pathName + "tom1.wav";
    var tom2Path = pathName + "tom2.wav";
    var tom3Path = pathName + "tom3.wav";

    this.loadSample(0, kickPath, false);
    this.loadSample(1, snarePath, false);
    this.loadSample(2, hihatPath, true);  // we're panning only the hihat
    this.loadSample(3, tom1Path, false);
    this.loadSample(4, tom2Path, false);
    this.loadSample(5, tom3Path, false);
}

var decodedFunctions = [
    function (buffer) { this.kickBuffer = buffer; },
    function (buffer) { this.snareBuffer = buffer; },
    function (buffer) { this.hihatBuffer = buffer; },
    function (buffer) { this.tom1 = buffer; },
    function (buffer) { this.tom2 = buffer; },
    function (buffer) { this.tom3 = buffer; } ];

Kit.prototype.loadSample = function(sampleID, url, mixToMono) {
    // Load asynchronously

    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    var kit = this;

    request.onload = function() {
        context.decodeAudioData(request.response, decodedFunctions[sampleID].bind(kit));

        kit.instrumentLoadCount++;
        if (kit.instrumentLoadCount == kit.instrumentCount) {
            kit.isLoaded = true;

            if (kit.demoIndex != -1) {
                beatDemo[kit.demoIndex].setKitLoaded();
            }
        }
    }

    request.send();
}

var impulseResponseInfoList = [
    // Impulse responses - each one represents a unique linear effect.
    {"name":"No Effect", "url":"undefined", "dryMix":1, "wetMix":0},
    {"name":"Spreader 2", "url":"impulse-responses/noise-spreader1.wav",        "dryMix":1, "wetMix":1},
    {"name":"Spring Reverb", "url":"impulse-responses/feedback-spring.wav",     "dryMix":1, "wetMix":1},
    {"name":"Space Oddity", "url":"impulse-responses/filter-rhythm3.wav",       "dryMix":1, "wetMix":0.7},
    {"name":"Huge Reverse", "url":"impulse-responses/matrix6-backwards.wav",    "dryMix":0, "wetMix":0.7},
    {"name":"Telephone Filter", "url":"impulse-responses/filter-telephone.wav", "dryMix":0, "wetMix":1.2},
    {"name":"Lopass Filter", "url":"impulse-responses/filter-lopass160.wav",    "dryMix":0, "wetMix":0.5},
    {"name":"Hipass Filter", "url":"impulse-responses/filter-hipass5000.wav",   "dryMix":0, "wetMix":4.0},
    {"name":"Comb 1", "url":"impulse-responses/comb-saw1.wav",                  "dryMix":0, "wetMix":0.7},
    {"name":"Comb 2", "url":"impulse-responses/comb-saw2.wav",                  "dryMix":0, "wetMix":1.0},
    {"name":"Cosmic Ping", "url":"impulse-responses/cosmic-ping-long.wav",      "dryMix":0, "wetMix":0.9},
    {"name":"Kitchen", "url":"impulse-responses/house-impulses/kitchen-true-stereo.wav", "dryMix":1, "wetMix":1},
    {"name":"Living Room", "url":"impulse-responses/house-impulses/dining-living-true-stereo.wav", "dryMix":1, "wetMix":1},
    {"name":"Living-Bedroom", "url":"impulse-responses/house-impulses/living-bedroom-leveled.wav", "dryMix":1, "wetMix":1},
    {"name":"Dining-Far-Kitchen", "url":"impulse-responses/house-impulses/dining-far-kitchen.wav", "dryMix":1, "wetMix":1},
    {"name":"Medium Hall 1", "url":"impulse-responses/matrix-reverb2.wav",      "dryMix":1, "wetMix":1},
    {"name":"Medium Hall 2", "url":"impulse-responses/matrix-reverb3.wav",      "dryMix":1, "wetMix":1},
    {"name":"Peculiar", "url":"impulse-responses/peculiar-backwards.wav",       "dryMix":1, "wetMix":1},
    {"name":"Backslap", "url":"impulse-responses/backslap1.wav",                "dryMix":1, "wetMix":1},
    {"name":"Diffusor", "url":"impulse-responses/diffusor3.wav",                "dryMix":1, "wetMix":1},
    {"name":"Huge", "url":"impulse-responses/matrix-reverb6.wav",               "dryMix":1, "wetMix":0.7},
]

var impulseResponseList = 0;

function ImpulseResponse(url, index) {
    this.url = url;
    this.index = index;
    this.startedLoading = false;
    this.isLoaded_ = false;
    this.buffer = 0;

    this.demoIndex = -1; // no demo
}

ImpulseResponse.prototype.setDemoIndex = function(index) {
    this.demoIndex = index;
}

ImpulseResponse.prototype.isLoaded = function() {
    return this.isLoaded_;
}

function loadedImpulseResponse(buffer) {
    this.buffer = buffer;
    this.isLoaded_ = true;

    if (this.demoIndex != -1) {
        beatDemo[this.demoIndex].setEffectLoaded();
    }
}

ImpulseResponse.prototype.load = function() {
    if (this.startedLoading) {
        return;
    }

    this.startedLoading = true;

    // Load asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", this.url, true);
    request.responseType = "arraybuffer";
    this.request = request;

    var asset = this;

    request.onload = function() {
        context.decodeAudioData(request.response, loadedImpulseResponse.bind(asset) );
    }

    request.send();
}

function startLoadingAssets() {
    impulseResponseList = new Array();

    for (i = 0; i < impulseResponseInfoList.length; i++) {
        impulseResponseList[i] = new ImpulseResponse(impulseResponseInfoList[i].url, i);
    }

    // Initialize drum kits
    var numKits = kitName.length;
    kits = new Array(numKits);
    for (var i  = 0; i < numKits; i++) {
        kits[i] = new Kit(kitName[i]);
    }

    // Start loading the assets used by the presets first, in order of the presets.
    for (var demoIndex = 0; demoIndex < 5; ++demoIndex) {
        var effect = impulseResponseList[beatDemo[demoIndex].effectIndex];
        var kit = kits[beatDemo[demoIndex].kitIndex];

        // These effects and kits will keep track of a particular demo, so we can change
        // the loading status in the UI.
        effect.setDemoIndex(demoIndex);
        kit.setDemoIndex(demoIndex);

        effect.load();
        kit.load();
    }

    // Then load the remaining assets.
    // Note that any assets which have previously started loading will be skipped over.
    for (var i  = 0; i < numKits; i++) {
        kits[i].load();
    }

    // Start at 1 to skip "No Effect"
    for (i = 1; i < impulseResponseInfoList.length; i++) {
        impulseResponseList[i].load();
    }

    // Setup initial drumkit
    currentKit = kits[kInitialKitIndex];
}

function demoButtonURL(demoIndex) {
    var n = demoIndex + 1;
    var demoName = "demo" + n;
    var url = "images/btn_" + demoName + ".png";
    return url;
}

// This gets rid of the loading spinner in each of the demo buttons.
function showDemoAvailable(demoIndex /* zero-based */) {
    var url = demoButtonURL(demoIndex);
    var n = demoIndex + 1;
    var demoName = "demo" + n;
    var demo = document.getElementById(demoName);
    demo.src = url;

    // Enable play button and assign it to demo 2.
    if (demoIndex == 1) {
        showPlayAvailable();
        loadBeat(beatDemo[1]);

        // Uncomment to allow autoplay
        //     handlePlay();
    }
}

// This gets rid of the loading spinner on the play button.
function showPlayAvailable() {
    var play = document.getElementById("play");
    play.src = "images/btn_play.png";
}

function init() {
    // Let the beat demos know when all of their assets have been loaded.
    // Add some new methods to support this.
    for (var i = 0; i < beatDemo.length; ++i) {
        beatDemo[i].index = i;
        beatDemo[i].isKitLoaded = false;
        beatDemo[i].isEffectLoaded = false;

        beatDemo[i].setKitLoaded = function() {
            this.isKitLoaded = true;
            this.checkIsLoaded();
        };

        beatDemo[i].setEffectLoaded = function() {
            this.isEffectLoaded = true;
            this.checkIsLoaded();
        };

        beatDemo[i].checkIsLoaded = function() {
            if (this.isLoaded()) {
                showDemoAvailable(this.index);
            }
        };

        beatDemo[i].isLoaded = function() {
            return this.isKitLoaded && this.isEffectLoaded;
        };
    }

    startLoadingAssets();

    // NOTE: THIS NOW RELIES ON THE MONKEYPATCH LIBRARY TO LOAD
    // IN CHROME AND SAFARI (until they release unprefixed)
    context = new AudioContext();

    var finalMixNode;
    if (context.createDynamicsCompressor) {
        // Create a dynamics compressor to sweeten the overall mix.
        compressor = context.createDynamicsCompressor();
        compressor.connect(context.destination);
        finalMixNode = compressor;
    } else {
        // No compressor available in this implementation.
        finalMixNode = context.destination;
    }

    // create master filter node
    filterNode = context.createBiquadFilter();
    filterNode.type = "lowpass";
    filterNode.frequency.value = 0.5 * context.sampleRate;
    filterNode.Q.value = 1;
    filterNode.connect(finalMixNode);

    // Create master volume.
    masterGainNode = context.createGain();
    masterGainNode.gain.value = 0.7; // reduce overall volume to avoid clipping
    masterGainNode.connect(filterNode);

    // Create effect volume.
    effectLevelNode = context.createGain();
    effectLevelNode.gain.value = 1.0; // effect level slider controls this
    effectLevelNode.connect(masterGainNode);

    // Create convolver for effect
    convolver = context.createConvolver();
    convolver.connect(effectLevelNode);


    var elKitCombo = document.getElementById('kitcombo');
    var elLoopCombo = document.getElementById('loopcombo');
    elKitCombo.addEventListener("mousedown", handleKitComboMouseDown, true);
    elLoopCombo.addEventListener("mousedown", handleLoopComboMouseDown, true);

    var elEffectCombo = document.getElementById('effectcombo');
    elEffectCombo.addEventListener("mousedown", handleEffectComboMouseDown, true);

    document.body.addEventListener("mousedown", handleBodyMouseDown, true);

    initControls();
    updateControls();
    hide(32);

    var timerWorkerBlob = new Blob([
        "var timeoutID=0;function schedule(){timeoutID=setTimeout(function(){postMessage('schedule'); schedule();},100);} onmessage = function(e) { if (e.data == 'start') { if (!timeoutID) schedule();} else if (e.data == 'stop') {if (timeoutID) clearTimeout(timeoutID); timeoutID=0;};}"]);

    // Obtain a blob URL reference to our worker 'file'.
    var timerWorkerBlobURL = window.URL.createObjectURL(timerWorkerBlob);

    timerWorker = new Worker(timerWorkerBlobURL);
    timerWorker.onmessage = function(e) {
        schedule();
    };
    timerWorker.postMessage('init'); // Start the worker.

}

function initControls() {
    // Initialize note buttons
    initButtons();
    makeKitList();
    makeLoopList();
    makeEffectList();

    // sliders
    document.getElementById('effect_thumb').addEventListener('mousedown', handleSliderMouseDown, true);
    document.getElementById('tom1_thumb').addEventListener('mousedown', handleSliderMouseDown, true);
    document.getElementById('tom2_thumb').addEventListener('mousedown', handleSliderMouseDown, true);
    document.getElementById('tom3_thumb').addEventListener('mousedown', handleSliderMouseDown, true);
    document.getElementById('hihat_thumb').addEventListener('mousedown', handleSliderMouseDown, true);
    document.getElementById('snare_thumb').addEventListener('mousedown', handleSliderMouseDown, true);
    document.getElementById('kick_thumb').addEventListener('mousedown', handleSliderMouseDown, true);
    document.getElementById('swing_thumb').addEventListener('mousedown', handleSliderMouseDown, true);

    document.getElementById('effect_thumb').addEventListener('dblclick', handleSliderDoubleClick, true);
    document.getElementById('tom1_thumb').addEventListener('dblclick', handleSliderDoubleClick, true);
    document.getElementById('tom2_thumb').addEventListener('dblclick', handleSliderDoubleClick, true);
    document.getElementById('tom3_thumb').addEventListener('dblclick', handleSliderDoubleClick, true);
    document.getElementById('hihat_thumb').addEventListener('dblclick', handleSliderDoubleClick, true);
    document.getElementById('snare_thumb').addEventListener('dblclick', handleSliderDoubleClick, true);
    document.getElementById('kick_thumb').addEventListener('dblclick', handleSliderDoubleClick, true);
    document.getElementById('swing_thumb').addEventListener('dblclick', handleSliderDoubleClick, true);

    // tool buttons
    document.getElementById('play').addEventListener('mousedown', handlePlayButton, true);
    //document.getElementById('stop').addEventListener('mousedown', handleStop, true);
    document.getElementById('save').addEventListener('mousedown', handleSave, true);
    document.getElementById('save_ok').addEventListener('mousedown', handleSaveOk, true);
    document.getElementById('load').addEventListener('mousedown', handleLoad, true);
    //document.getElementById('load_ok').addEventListener('mousedown', handleLoadOk, true);
    document.getElementById('load_cancel').addEventListener('mousedown', handleLoadCancel, true);
    document.getElementById('reset').addEventListener('mousedown', handleReset, true);
    document.getElementById('demo1').addEventListener('mousedown', handleDemoMouseDown, true);
    document.getElementById('demo2').addEventListener('mousedown', handleDemoMouseDown, true);
    document.getElementById('demo3').addEventListener('mousedown', handleDemoMouseDown, true);
    document.getElementById('demo4').addEventListener('mousedown', handleDemoMouseDown, true);
    document.getElementById('demo5').addEventListener('mousedown', handleDemoMouseDown, true);

    var elBody = document.getElementById('body');
    elBody.addEventListener('mousemove', handleMouseMove, true);
    elBody.addEventListener('mouseup', handleMouseUp, true);

    document.getElementById('tempoinc').addEventListener('mousedown', tempoIncrease, true);
    document.getElementById('tempodec').addEventListener('mousedown', tempoDecrease, true);
}

function initButtons() {
    var elButton;

    for (i = 0; i < 24; ++i) {
        for (j = 0; j < kNumInstruments; j++) {
            elButton = document.getElementById(instruments[j] + '_' + i);
            elButton.addEventListener("mousedown", handleButtonMouseDown, true);
        }
    }
}

playButton = document.getElementById('play');

function makeEffectList() {
    var elList = document.getElementById('effectlist');
    var numEffects = impulseResponseInfoList.length;


    var elItem = document.createElement('li');
    elItem.innerHTML = 'None';
    elItem.addEventListener("mousedown", handleEffectMouseDown, true);

    for (var i = 0; i < numEffects; i++) {
        var elItem = document.createElement('li');
        elItem.innerHTML = impulseResponseInfoList[i].name;
        elList.appendChild(elItem);
        elItem.addEventListener("mousedown", handleEffectMouseDown, true);
    }
}

function makeKitList() {
    var elList = document.getElementById('kitlist');
    var numKits = kitName.length;

    for (var i = 0; i < numKits; i++) {
        var elItem = document.createElement('li');
        elItem.innerHTML = kitNamePretty[i];
        elList.appendChild(elItem);
        elItem.addEventListener("mousedown", handleKitMouseDown, true);
    }
}

function makeLoopList() {
    var elList = document.getElementById('looplist');
    var numKits = loopOptions.length;

    for (var i = 0; i < numKits; i++) {
        var elItem = document.createElement('li');
        elItem.innerHTML = loopOptions[i];
        elList.appendChild(elItem);
        elItem.addEventListener("mousedown", handleLoopMouseDown, true);
    }
}

var i = 0;

function advanceNote() {
    // Advance time by a 16th note...
    var secondsPerBeat = 60.0 / theBeat.tempo;

    rhythmIndex++;
    if (rhythmIndex == loopLength) {
        rhythmIndex = 0;
        i++;
    }
    //console.log('Current loops: ' + (i - (loopLength - 1)));

    // apply swing
    if (rhythmIndex % 2) {
        noteTime += (0.25 + kMaxSwing * theBeat.swingFactor) * secondsPerBeat;
    } else {
        noteTime += (0.25 - kMaxSwing * theBeat.swingFactor) * secondsPerBeat;
    }
}

function playNote(buffer, pan, x, y, z, sendGain, mainGain, playbackRate, noteTime) {
    // Create the note
    var voice = context.createBufferSource();
    voice.buffer = buffer;
    voice.playbackRate.value = playbackRate;

    // Optionally, connect to a panner
    var finalNode;
    if (pan) {
        var panner = context.createPanner();
        panner.panningModel = "HRTF";
        panner.setPosition(x, y, z);
        voice.connect(panner);
        finalNode = panner;
    } else {
        finalNode = voice;
    }

    // Connect to dry mix
    var dryGainNode = context.createGain();
    dryGainNode.gain.value = mainGain * effectDryMix;
    finalNode.connect(dryGainNode);
    dryGainNode.connect(masterGainNode);

    // Connect to wet mix
    var wetGainNode = context.createGain();
    wetGainNode.gain.value = sendGain;
    finalNode.connect(wetGainNode);
    wetGainNode.connect(convolver);

    voice.start(noteTime);
}

function schedule() {
    var currentTime = context.currentTime;

    // The sequence starts at startTime, so normalize currentTime so that it's 0 at the start of the sequence.
    currentTime -= startTime;

    while (noteTime < currentTime + 0.120) {
        // Convert noteTime to context time.
        var contextPlayTime = noteTime + startTime;

        // Kick
        if (rhythm1[rhythmIndex] && instrumentActive[0]) {
            playNote(currentKit.kickBuffer, false, 0,0,-2, 0.5, volumes[rhythm1[rhythmIndex]] * 1.0, kickPitch, contextPlayTime);
        }

        // Snare
        if (rhythm2[rhythmIndex] && instrumentActive[1]) {
            playNote(currentKit.snareBuffer, false, 0,0,-2, 1, volumes[rhythm2[rhythmIndex]] * 0.6, snarePitch, contextPlayTime);
        }

        // Hihat
        if (rhythm3[rhythmIndex] && instrumentActive[2]) {
            // Pan the hihat according to sequence position.
            playNote(currentKit.hihatBuffer, true, 0.5*rhythmIndex - 4, 0, -1.0, 1, volumes[rhythm3[rhythmIndex]] * 0.7, hihatPitch, contextPlayTime);
        }

        // Toms
        if (rhythm4[rhythmIndex] && instrumentActive[3]) {
            playNote(currentKit.tom1, false, 0,0,-2, 1, volumes[rhythm4[rhythmIndex]] * 0.6, tom1Pitch, contextPlayTime);
        }

        if (rhythm5[rhythmIndex] && instrumentActive[4]) {
            playNote(currentKit.tom2, false, 0,0,-2, 1, volumes[rhythm5[rhythmIndex]] * 0.6, tom2Pitch, contextPlayTime);
        }

        if (rhythm6[rhythmIndex] && instrumentActive[5]) {
            playNote(currentKit.tom3, false, 0,0,-2, 1, volumes[rhythm6[rhythmIndex]] * 0.6, tom3Pitch, contextPlayTime);
        }


        // Attempt to synchronize drawing time with sound
        if (noteTime != lastDrawTime) {
            lastDrawTime = noteTime;
            drawPlayhead((rhythmIndex + (loopLength - 1)) % loopLength);
        }

        advanceNote();
    }
}

function playDrum(noteNumber, velocity) {
    switch (noteNumber) {
        case 0x24:
            playNote(currentKit.kickBuffer,  false, 0,0,-2,  0.5, (velocity / 127), kickPitch,  0);
            break;
        case 0x26:
            playNote(currentKit.snareBuffer, false, 0,0,-2,  1,   (velocity / 127), snarePitch, 0);
            break;
        case 0x28:
            playNote(currentKit.hihatBuffer, true,  0,0,-1.0,1,   (velocity / 127), hihatPitch, 0);
            break;
        case 0x2d:
            playNote(currentKit.tom1,        false, 0,0,-2,  1,   (velocity / 127), tom1Pitch,  0);
            break;
        case 0x2f:
            playNote(currentKit.tom2,        false, 0,0,-2,  1,   (velocity / 127), tom2Pitch,  0);
            break;
        case 0x32:
            playNote(currentKit.tom3,        false, 0,0,-2,  1,   (velocity / 127), tom3Pitch,  0);
            break;
        default:
            console.log("note:0x" + noteNumber.toString(loopLength) );
    }
}


function tempoIncrease() {
    theBeat.tempo = Math.min(kMaxTempo, theBeat.tempo+4);
    document.getElementById('tempo').innerHTML = theBeat.tempo;
}

function tempoDecrease() {
    theBeat.tempo = Math.max(kMinTempo, theBeat.tempo-4);
    document.getElementById('tempo').innerHTML = theBeat.tempo;
}

function handleSliderMouseDown(event) {
    mouseCapture = event.target.id;

    // calculate offset of mousedown on slider
    var el = event.target;
    if (mouseCapture == 'swing_thumb') {
        var thumbX = 0;
        do {
            thumbX += el.offsetLeft;
        } while (el = el.offsetParent);

        mouseCaptureOffset = event.pageX - thumbX;
    } else {
        var thumbY = 0;
        do {
            thumbY += el.offsetTop;
        } while (el = el.offsetParent);

        mouseCaptureOffset = event.pageY - thumbY;
    }
}

function handleSliderDoubleClick(event) {
    var id = event.target.id;
    if (id != 'swing_thumb' && id != 'effect_thumb') {
        mouseCapture = null;
        sliderSetValue(event.target.id, 0.5);
        updateControls();
    }
}

function handleMouseMove(event) {
    if (!mouseCapture) return;

    var elThumb = document.getElementById(mouseCapture);
    var elTrack = elThumb.parentNode;

    if (mouseCapture != 'swing_thumb') {
        var thumbH = elThumb.clientHeight;
        var trackH = elTrack.clientHeight;
        var travelH = trackH - thumbH;

        var trackY = 0;
        var el = elTrack;
        do {
            trackY += el.offsetTop;
        } while (el = el.offsetParent);

        var offsetY = Math.max(0, Math.min(travelH, event.pageY - mouseCaptureOffset - trackY));
        var value = 1.0 - offsetY / travelH;
        elThumb.style.top = travelH * (1.0 - value) + 'px';
    } else {
        var thumbW = elThumb.clientWidth;
        var trackW = elTrack.clientWidth;
        var travelW = trackW - thumbW;

        var trackX = 0;
        var el = elTrack;
        do {
            trackX += el.offsetLeft;
        } while (el = el.offsetParent);

        var offsetX = Math.max(0, Math.min(travelW, event.pageX - mouseCaptureOffset - trackX));
        var value = offsetX / travelW;
        elThumb.style.left = travelW * value + 'px';
    }

    sliderSetValue(mouseCapture, value);
}

function handleMouseUp() {
    mouseCapture = null;
}

function sliderSetValue(slider, value) {
    var pitchRate = Math.pow(2.0, 2.0 * (value - 0.5));

    switch(slider) {
        case 'effect_thumb':
            // Change the volume of the convolution effect.
            theBeat.effectMix = value;
            setEffectLevel(theBeat);
            break;
        case 'kick_thumb':
            theBeat.kickPitchVal = value;
            kickPitch = pitchRate;
            break;
        case 'snare_thumb':
            theBeat.snarePitchVal = value;
            snarePitch = pitchRate;
            break;
        case 'hihat_thumb':
            theBeat.hihatPitchVal = value;
            hihatPitch = pitchRate;
            break;
        case 'tom1_thumb':
            theBeat.tom1PitchVal = value;
            tom1Pitch = pitchRate;
            break;
        case 'tom2_thumb':
            theBeat.tom2PitchVal = value;
            tom2Pitch = pitchRate;
            break;
        case 'tom3_thumb':
            theBeat.tom3PitchVal = value;
            tom3Pitch = pitchRate;
            break;
        case 'swing_thumb':
            theBeat.swingFactor = value;
            break;
    }
}

function sliderSetPosition(slider, value) {
    var elThumb = document.getElementById(slider);
    var elTrack = elThumb.parentNode;

    if (slider == 'swing_thumb') {
        var thumbW = elThumb.clientWidth;
        var trackW = elTrack.clientWidth;
        var travelW = trackW - thumbW;

        elThumb.style.left = travelW * value + 'px';
    } else {
        var thumbH = elThumb.clientHeight;
        var trackH = elTrack.clientHeight;
        var travelH = trackH - thumbH;

        elThumb.style.top = travelH * (1.0 - value) + 'px';
    }
}

function handleButtonMouseDown(event) {
    var notes = getRhythm(1);

    var instrumentIndex;
    var rhythmIndex;

    var elId = event.target.id;
    rhythmIndex = elId.substr(elId.indexOf('_') + 1, 2);
    instrumentIndex = instruments.indexOf(elId.substr(0, elId.indexOf('_')));
    switch (instrumentIndex) {
        case 0: notes = rhythm1; break;
        case 1: notes = rhythm2; break;
        case 2: notes = rhythm3; break;
        case 3: notes = rhythm4; break;
        case 4: notes = rhythm5; break;
        case 5: notes = rhythm6; break;
    }

    notes[rhythmIndex] = (notes[rhythmIndex] + 1) % 3;
    if (instrumentIndex == currentlyActiveInstrument)
        showCorrectNote( rhythmIndex, notes[rhythmIndex] );
    
        drawNote(notes[rhythmIndex], rhythmIndex, instrumentIndex);
    
    var note = notes[rhythmIndex];

    if (note) {
        switch(instrumentIndex) {
            case 0:  // Kick
                playNote(currentKit.kickBuffer, false, 0,0,-2, 0.5 * theBeat.effectMix, volumes[note] * 1.0, kickPitch, 0);
                break;

            case 1:  // Snare
                playNote(currentKit.snareBuffer, false, 0,0,-2, theBeat.effectMix, volumes[note] * 0.6, snarePitch, 0);
                break;

            case 2:  // Hihat
                // Pan the hihat according to sequence position.
                playNote(currentKit.hihatBuffer, true, 0.5*rhythmIndex - 4, 0, -1.0, theBeat.effectMix, volumes[note] * 0.7, hihatPitch, 0);
                break;

            case 3:  // Tom 1
                playNote(currentKit.tom1, false, 0,0,-2, theBeat.effectMix, volumes[note] * 0.6, tom1Pitch, 0);
                break;

            case 4:  // Tom 2
                playNote(currentKit.tom2, false, 0,0,-2, theBeat.effectMix, volumes[note] * 0.6, tom2Pitch, 0);
                break;

            case 5:  // Tom 3
                playNote(currentKit.tom3, false, 0,0,-2, theBeat.effectMix, volumes[note] * 0.6, tom3Pitch, 0);
                break;
        }
    }
}

function handleKitComboMouseDown(event) {
    document.getElementById('kitcombo').classList.toggle('active');
}

function handleLoopComboMouseDown(event) {
    document.getElementById('loopcombo').classList.toggle('active');
}

function handleKitMouseDown(event) {
    var index = kitNamePretty.indexOf(event.target.innerHTML);
    theBeat.kitIndex = index;
    currentKit = kits[index];
    document.getElementById('kitname').innerHTML = kitNamePretty[index];

}

function updateRhythms(){
    rhythm1 = getRhythm(1);
    rhythm2 = getRhythm(2);
    rhythm3 = getRhythm(3);
    rhythm4 = getRhythm(4);
    rhythm5 = getRhythm(5);
    rhythm6 = getRhythm(6);
}


function handleLoopMouseDown(event) {
    var index = loopOptions.indexOf(parseInt(event.target.innerHTML, 10)); // Match clicked value in loopOptions
    if (index !== -1) { // Ensure the selection is valid
        var prev=loopLength;
        loopLength = loopOptions[index]; // Update global loopLength
        hide(prev);
        document.getElementById('loopname').innerHTML = loopLength; // Update UI display
        updateRhythms();
        rhythmIndex = 0; // Reset rhythm index to match new loop length
        updateControls(); // Refresh UI to reflect changes
    }
}


function handleBodyMouseDown(event) {
    var elKitcombo = document.getElementById('kitcombo');
    var elLoopcombo = document.getElementById('loopcombo');
    var elEffectcombo = document.getElementById('effectcombo');

    if (elKitcombo.classList.contains('active') && !isDescendantOfId(event.target, 'kitcombo_container')) {
        elKitcombo.classList.remove('active');
        if (!isDescendantOfId(event.target, 'effectcombo_container')) {
            event.stopPropagation();
        }
    }

    if (elLoopcombo.classList.contains('active') && !isDescendantOfId(event.target, 'loopcombo_container')) {
        elLoopcombo.classList.remove('active');
        if (!isDescendantOfId(event.target, 'effectcombo_container')) {
            event.stopPropagation();
        }
    }

    if (elEffectcombo.classList.contains('active') && !isDescendantOfId(event.target, 'effectcombo')) {
        elEffectcombo.classList.remove('active');
        if (!isDescendantOfId(event.target, 'kitcombo_container')) {
            event.stopPropagation();
        }
    }
}

function isDescendantOfId(el, id) {
    if (el.parentElement) {
        if (el.parentElement.id == id) {
            return true;
        } else {
            return isDescendantOfId(el.parentElement, id);
        }
    } else {
        return false;
    }
}

function handleEffectComboMouseDown(event) {
    if (event.target.id != 'effectlist') {
        document.getElementById('effectcombo').classList.toggle('active');
    }
}

function handleEffectMouseDown(event) {
    for (var i = 0; i < impulseResponseInfoList.length; ++i) {
        if (impulseResponseInfoList[i].name == event.target.innerHTML) {

            // Hack - if effect is turned all the way down - turn up effect slider.
            // ... since they just explicitly chose an effect from the list.
            if (theBeat.effectMix == 0)
                theBeat.effectMix = 0.5;
            setEffect(i);
            break;
        }
    }
}

function setEffect(index) {
    if (index > 0 && !impulseResponseList[index].isLoaded()) {
        alert('Sorry, this effect is still loading.  Try again in a few seconds :)');
        return;
    }

    theBeat.effectIndex = index;
    effectDryMix = impulseResponseInfoList[index].dryMix;
    effectWetMix = impulseResponseInfoList[index].wetMix;
    convolver.buffer = impulseResponseList[index].buffer;

    // Hack - if the effect is meant to be entirely wet (not unprocessed signal)
    // then put the effect level all the way up.
    if (effectDryMix == 0)
        theBeat.effectMix = 1;

    setEffectLevel(theBeat);
    sliderSetValue('effect_thumb', theBeat.effectMix);
    updateControls();

    document.getElementById('effectname').innerHTML = impulseResponseInfoList[index].name;
}

function setEffectLevel() {
    // Factor in both the preset's effect level and the blending level (effectWetMix) stored in the effect itself.
    effectLevelNode.gain.value = theBeat.effectMix * effectWetMix;
}


function handleDemoMouseDown(event) {
    var loaded = false;

    function preloadBeat(){
        var prev=loopLength;
        loopLength = 16; // Update global loopLength
        hide(prev);
        document.getElementById('loopname').innerHTML = loopLength; // Update UI display
        updateRhythms();
        rhythmIndex = 0; // Reset rhythm index to match new loop length
    }
    
    switch(event.target.id) {
        case 'demo1':
            loaded = loadBeat(beatDemo[0]);
            preloadBeat();
            rhythm1 = [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            rhythm2 = [0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0];
            rhythm3 = [0,0,0,0,0,0,2,0,2,0,0,0,0,0,0,0];
            rhythm4 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0];
            rhythm5 = [0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0];
            rhythm6 = [0,0,0,0,0,0,0,2,0,2,2,0,0,0,0,0];
            updateControls(); // Refresh UI to reflect changes
            break;
        case 'demo2':
            loaded = loadBeat(beatDemo[1]);
            preloadBeat();
            rhythm1 = [2,1,0,0,0,0,0,0,2,1,2,1,0,0,0,0];
            rhythm2 = [0,0,0,0,2,0,0,0,0,1,1,0,2,0,0,0];
            rhythm3 = [0,1,2,1,0,1,2,1,0,1,2,1,0,1,2,1];
            rhythm4 = [0,0,0,0,0,0,2,1,0,0,0,0,0,0,0,0];
            rhythm5 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0];
            rhythm6 = [0,0,0,0,0,0,0,2,1,2,1,0,0,0,0,0];
            updateControls();
            break;
        case 'demo3':
            loaded = loadBeat(beatDemo[2]);
            preloadBeat();
            rhythm1 = [2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0];
            rhythm2 = [0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0];
            rhythm3 = [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0];
            rhythm4 = [1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1];
            rhythm5 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0];
            rhythm6 = [0,0,1,0,1,0,0,2,0,2,0,0,1,0,0,0];
            updateControls();
            break;
        case 'demo4':
            loaded = loadBeat(beatDemo[3]);
            preloadBeat();
            rhythm1 = [2,0,0,0,0,0,0,2,2,0,0,0,0,0,0,1];
            rhythm2 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            rhythm3 = [0,0,1,0,2,0,1,0,1,0,1,0,2,0,2,0];
            rhythm4 = [2,0,2,0,0,0,0,0,2,0,0,0,0,2,0,0];
            rhythm5 = [0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0];
            rhythm6 = [0,2,0,0,0,2,0,0,0,2,0,0,0,0,0,0];
            updateControls();
            break;
        case 'demo5':
            loaded = loadBeat(beatDemo[4]);
            preloadBeat();
            rhythm1 = [2,2,0,1,2,2,0,1,2,2,0,1,2,2,0,1];
            rhythm2 = [0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0];
            rhythm3 = [2,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1];
            rhythm4 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            rhythm5 = [0,0,1,0,0,1,0,1,0,0,1,0,0,0,1,0];
            rhythm6 = [1,0,0,1,0,1,0,1,1,0,0,1,1,1,1,0];
            updateControls();
            break;
    }

    if (loaded)
        handlePlay();
}


    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function setrecordingtime(BPM) {
        if(isPlaying){handleStop();}
        handlePlay();
        toggle_rec();
        console.log(BPM);
        await delay(BPM * 100); // Wait for 3 seconds
        toggle_rec();
        handleStop();
    }
    
var isPlaying = false;

function handlePlayButton(){
    if (isPlaying){
        handleStop()
    }
    else{
        handlePlay()
    }
}

function handlePlay(event) {
    noteTime = 0.0;
    isPlaying = true;
    startTime = context.currentTime + 0.005;
    schedule();
    timerWorker.postMessage("start");
    document.getElementById('play').classList.add('playing');
    document.getElementById('play').innerHTML = 'Stop';
    //document.getElementById('stop').classList.add('playing');
    if (midiOut) {
        // turn off the play button
        midiOut.send( [0x80, 3, 32] );
        // light up the stop button
        midiOut.send( [0x90, 7, 1] );
    }
}

function handleStop(event) {
    timerWorker.postMessage("stop");
    isPlaying = false;
    var elOld = document.getElementById('LED_' + (rhythmIndex + (loopLength - 2)) % loopLength);
    elOld.src = 'images/LED_off.png';

    hideBeat( (rhythmIndex + (loopLength - 2)) % loopLength );

    rhythmIndex = 0;

    document.getElementById('play').classList.remove('playing');
    document.getElementById('play').innerHTML = 'Play';
    //document.getElementById('stop').classList.remove('playing');
    if (midiOut) {
        // light up the play button
        midiOut.send( [0x90, 3, 32] );
        // turn off the stop button
        midiOut.send( [0x80, 7, 1] );
    }
}

function handleSave(event) {
    toggleSaveContainer();
    document.getElementById('title').innerHTML = 'Audio Recording';
    const mic_btn = document.getElementById('mic');
    const vocalPlaybackArea = document.getElementById('vocal-playback-area');
    const clearButton = document.getElementById('clear');

    mic_btn.addEventListener('click', ToggleMic);
    clearButton.addEventListener('click', clearRecordings);

    let canRecord = false;
    let isRecording = false;
    let recorder = null;
    let chunks = [];
    let recordings = [];

    function SetupAudio() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(SetupStream)
                .catch(err => console.error(err));
        }
    }

    SetupAudio();

    function SetupStream(stream) {
        recorder = new MediaRecorder(stream);

        recorder.ondataavailable = e => chunks.push(e.data);

        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'audio/mp3; codecs=opus' });
            chunks = [];

            const date = new Date();
            const filename = `recording_${date.toISOString().replace(/[-:T\.Z]/g, '')}.mp3`;
            const audioURL = URL.createObjectURL(blob);
            recordings.push({ url: audioURL, filename: filename }); // Store recording data

            displayRecordings();
        };

        canRecord = true;
    }

    function ToggleMic() {
        if (!canRecord) return;

        isRecording = !isRecording;
        mic_btn.classList.toggle('isRecording', isRecording);

        // Add this line to change button text
        mic_btn.textContent = isRecording ? 'Stop Recording' : 'Start Recording';

        if (isRecording) {
            recorder.start();
        } else {
            recorder.stop();
        }
    }

    function displayRecordings() {
        vocalPlaybackArea.innerHTML = '';
        clearButton.style.display = recordings.length > 0 ? 'inline-block' : 'none';

        recordings.forEach(recording => {
            const playbackContainer = document.createElement('div');
            playbackContainer.className = 'playback-container';

            const audio = document.createElement('audio');
            audio.controls = true;
            audio.src = recording.url;
            playbackContainer.appendChild(audio);

            const downloadLink = document.createElement('a');
            downloadLink.href = recording.url;
            downloadLink.download = recording.filename;
            downloadLink.className = 'download-btn';  // Add this line
            downloadLink.textContent = 'Download';    // Simplified text
            playbackContainer.appendChild(downloadLink);

            vocalPlaybackArea.appendChild(playbackContainer);
        });
    }
    function clearRecordings(){
        recordings = [];
        displayRecordings();
    }
}

let isRecording = false;
let mediaRecorder;
let recordedChunks = [];

function toggle_rec() {
    beat_rec_btn.textContent = !isRecording ? 'Stop Recording' : 'Start Recording';
    if (isRecording) {
        console.log("Stopped Recording");
        mediaRecorder.stop();
        isRecording = false;
        beat_rec_btn.classList.toggle('beatRecording', isRecording);
    } else {
        console.log("Began Recording");
        let drumMachineOutput = masterGainNode;
        let destination = context.createMediaStreamDestination();
        drumMachineOutput.connect(destination);
        isRecording = true;
        beat_rec_btn.classList.toggle('beatRecording', isRecording);
        mediaRecorder = new MediaRecorder(destination.stream);
        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                recordedChunks.push(e.data);
            }
        };
        mediaRecorder.onstop = handleRecordingStop;
        mediaRecorder.start();
    }
}


function handleRecordingStop() {
    const beatPlaybackArea = document.getElementById('beat-playback-area');
    beatPlaybackArea.innerHTML = ''; // Clear area once
    const clearButton = document.getElementById('clear-beat-rec');

    const mimeType = MediaRecorder.isTypeSupported('audio/mp4; codecs=opus')
    let blob = new Blob(recordedChunks, { type: mimeType });
    recordedChunks = [];
    isRecording = false;

    let audioURL = URL.createObjectURL(blob);
    console.log(blob);

    const playbackContainer = document.createElement('div');
    playbackContainer.className = 'playback-container';

    const beat_rec = document.createElement('audio');
    beat_rec.controls = true;
    beat_rec.src = audioURL;
    playbackContainer.appendChild(beat_rec);

    let downloadLink = document.createElement('a');
    downloadLink.href = audioURL;
    downloadLink.download = 'recording.mp4';
    downloadLink.textContent = 'Download';
    downloadLink.className = 'download-btn';
    playbackContainer.appendChild(downloadLink);

    beatPlaybackArea.appendChild(playbackContainer);
}


function handleSaveOk(event) {
    document.getElementById('title').innerHTML = 'Melodik Drum machine';
    toggleSaveContainer();
}

function handleLoad(event) {
    toggleLoadContainer();
    beat_rec_btn = document.getElementById('beat_rec_btn');
    beat_rec_btn.addEventListener("mousedown", toggle_rec);
    loopsCount = document.getElementById("loopsCount");
    loopsCount.addEventListener('change', handleOptionChange);
}

function handleOptionChange(event) {
    const selectedValue = event.target.value; // Get the value of the selected option
    console.log(`Selected option: ${selectedValue}`);
    var BPM = selectedValue * 10;

    if (isRecording) {toggle_rec();}
    else{setrecordingtime(BPM);}
    // You can now use `selectedValue` for any further logic
}

function handleLoadCancel(event) {
    toggleLoadContainer();
}

function toggleSaveContainer() {
    document.getElementById('pad').classList.toggle('active');
    document.getElementById('params').classList.toggle('active');
    document.getElementById('tools').classList.toggle('active');
    document.getElementById('save_container').classList.toggle('active');
}

function toggleLoadContainer() {
    document.getElementById('pad').classList.toggle('active');
    document.getElementById('params').classList.toggle('active');
    document.getElementById('tools').classList.toggle('active');
    document.getElementById('load_container').classList.toggle('active');
}

function handleReset(event) {
    for (var i = 0; i < loopLength; ++i) {
        rhythm1[i] = 0;
        rhythm2[i] = 0;
        rhythm3[i] = 0;
        rhythm4[i] = 0;
        rhythm5[i] = 0;
        rhythm6[i] = 0;
    }
    //handleStop();
    updateControls();
    loadBeat(beatReset);
}

function loadBeat(beat) {
    // Check that assets are loaded.
    if (beat != beatReset && !beat.isLoaded())
        return false;

    handleStop();

    theBeat = cloneBeat(beat);
    currentKit = kits[theBeat.kitIndex];
    setEffect(theBeat.effectIndex);

    // apply values from sliders
    sliderSetValue('effect_thumb', theBeat.effectMix);
    sliderSetValue('kick_thumb', theBeat.kickPitchVal);
    sliderSetValue('snare_thumb', theBeat.snarePitchVal);
    sliderSetValue('hihat_thumb', theBeat.hihatPitchVal);
    sliderSetValue('tom1_thumb', theBeat.tom1PitchVal);
    sliderSetValue('tom2_thumb', theBeat.tom2PitchVal);
    sliderSetValue('tom3_thumb', theBeat.tom3PitchVal);
    sliderSetValue('swing_thumb', theBeat.swingFactor);

    
    updateControls();
    setActiveInstrument(0);

    return true;
}

function updateControls() {
    for (i = 0; i < loopLength; ++i) {
        for (j = 0; j < kNumInstruments; j++) {
            switch (j) {
                case 0: notes = rhythm1; break;
                case 1: notes = rhythm2; break;
                case 2: notes = rhythm3; break;
                case 3: notes = rhythm4; break;
                case 4: notes = rhythm5; break;
                case 5: notes = rhythm6; break;
            }

            drawNote(notes[i], i, j);
        }
    }

    document.getElementById('kitname').innerHTML = kitNamePretty[theBeat.kitIndex];
    document.getElementById('loopname').innerHTML = loopLength;
    document.getElementById('effectname').innerHTML = impulseResponseInfoList[theBeat.effectIndex].name;
    document.getElementById('tempo').innerHTML = theBeat.tempo;
    sliderSetPosition('swing_thumb', theBeat.swingFactor);
    sliderSetPosition('effect_thumb', theBeat.effectMix);
    sliderSetPosition('kick_thumb', theBeat.kickPitchVal);
    sliderSetPosition('snare_thumb', theBeat.snarePitchVal);
    sliderSetPosition('hihat_thumb', theBeat.hihatPitchVal);
    sliderSetPosition('tom1_thumb', theBeat.tom1PitchVal);
    sliderSetPosition('tom2_thumb', theBeat.tom2PitchVal);
    sliderSetPosition('tom3_thumb', theBeat.tom3PitchVal);
}


function drawNote(draw, xindex, yindex) {
    var elButton = document.getElementById(instruments[yindex] + '_' + xindex);
    switch (draw) {
        case 0: elButton.src = 'images/button_off.png'; break;
        case 1: elButton.src = 'images/button_half.png'; break;
        case 2: elButton.src = 'images/button_on.png'; break;
    }
}

function drawPlayhead(xindex) {
    var lastIndex = (xindex + (loopLength - 1)) % loopLength;

    var elNew = document.getElementById('LED_' + xindex);
    var elOld = document.getElementById('LED_' + lastIndex);

    elNew.src = 'images/LED_on.png';
    elOld.src = 'images/LED_off.png';

    hideBeat( lastIndex );
    showBeat( xindex );
}

function filterFrequencyFromCutoff( cutoff ) {
    var nyquist = 0.5 * context.sampleRate;

    // spreads over a ~ten-octave range, from 20Hz - 20kHz.
    var filterFrequency = Math.pow(2, (11 * cutoff)) * 40;

    if (filterFrequency > nyquist)
        filterFrequency = nyquist;
    return filterFrequency;
}

function setFilterCutoff( cutoff ) {
    if (filterNode)
        filterNode.frequency.value = filterFrequencyFromCutoff( cutoff );
}

function setFilterQ( Q ) {
    if (filterNode)
        filterNode.Q.value = Q;
}

// RECORD HANDLING

