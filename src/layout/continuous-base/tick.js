const nop = function(){};

let tick = function( state ){
  let s = state;
  let l = state.layout;

  let tickIndicatesDone = l.tick( s );

  if( s.firstUpdate ){
    if( s.animateContinuously ){ // indicate the initial positions have been set
      s.layout.emit('layoutready');
    }
    s.firstUpdate = false;
  }

  let duration = Date.now() - s.startTime;

  return !s.infinite && ( tickIndicatesDone ) // || s.tickIndex >= s.maxIterations || duration >= s.maxSimulationTime );
};

let multitick = function( state, onNotDone = nop, onDone = nop ){
  let done = false;
  let s = state;

  // SLOWING DOWN ANIMATE
  if(s.animateContinuously){
    s.now = Date.now();
    s.elapsed = s.now - s.then;
    if (s.elapsed > s.fpsInterval) {
      // Get ready for next frame by setting then=now, but also adjust for your
      // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
      s.then = s.now - (s.elapsed % s.fpsInterval);

      // Put your drawing code here
      for( let i = 0; i < s.refresh; i++ ){
        done = !s.running || tick( s );

        if( done ){ break; }
      }
    }
  }
  else{
    for( let i = 0; i < s.refresh; i++ ){
      done = !s.running || tick( s );

      if( done ){ break; }
    }
  }

  if( !done ){
    onNotDone();
  } else {
    onDone();
  }
};

module.exports = { tick, multitick };
