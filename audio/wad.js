var saw = new Wad({source : 'sawtooth'})
saw.play({
    volume  : 0.8,
    wait    : 0,     // Time in seconds between calling play() and actually triggering the note.
    loop    : false, // This overrides the value for loop on the constructor, if it was set. 
    pitch   : 'A4',  // A4 is 440 hertz.
    label   : 'A',   // A label that identifies this note.
    env     : {hold : 9001},
    panning : [1, -1, 10],
    filter  : {frequency : 900},
    delay   : {delayTime : .8}
})