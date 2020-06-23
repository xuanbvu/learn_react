import React, { Component } from "react";
import "./Metronome.css";
import click1 from "./sound/click1.wav";
import click2 from "./sound/click2.wav";

class Metronome extends Component {
  constructor(props) {
    super(props);

    // initializes states
    this.state = {
      playing: false,
      count: 0,
      bpm: 60,
      beatsPerMeasure: 2,
      stressFirstBeat: false,
      time: 1,
      timer: false
    };

    // creates Audio objects with webpack files
    this.click1 = new Audio(click1);
    this.click2 = new Audio(click2);
  }

  handleBpmChange = new_bpm => {
    // sets bpm to input value
    const bpm = new_bpm;

    if (this.state.playing) {
      // stop old timer and start a new one
      clearInterval(this.timer);
      this.timer = setInterval(
        this.playClick,
        // 60 for per minute, 1000 to convert ms to s
        (60 / bpm) * 1000
      );

      // set new bpm and reset beat counter
      this.setState({
        count: 0,
        bpm: bpm
      });
    }
    // if not, just update bpm
    else {
      this.setState({ bpm: bpm });
    }
  };
  startStop = () => {
    if (this.state.playing) {
      // stop and clear the timer
      clearInterval(this.timer);
      this.setState({
        playing: false
      });
    } else {
      // start a timer with the current bpm
      this.timer = setInterval(this.playClick, (60 / this.state.bpm) * 1000);
      this.setState(
        {
          count: 0,
          playing: true
        },
        // play a click immediately (after setState finishes)
        this.playClick
      );
    }
  };
  playClick = () => {
    const { count, beatsPerMeasure, stressFirstBeat } = this.state;
    // first beat will have different sound than the others
    if (stressFirstBeat && count === 0) {
      this.click2.play();
    } else {
      this.click1.play();
    }
    // keep track of which beat we're on
    this.setState({
      count: (count + 1) % beatsPerMeasure
    });
  };
  handleStressChange = () => {
    this.setState({ stressFirstBeat: !this.state.stressFirstBeat });
  };
  handleTimeChange = () => {
    this.setState({ timer: !this.state.timer });
  };
  handleSlider = event => {
    this.handleBpmChange(parseInt(event.target.value));
  };
  minusBpm = () => {
    if (this.state.bpm > 20) {
      const new_bpm = this.state.bpm - 1;
      this.handleBpmChange(new_bpm);
    }
  };
  addBpm = () => {
    if (this.state.bpm < 260) {
      const new_bpm = this.state.bpm + 1;
      this.handleBpmChange(new_bpm);
    }
  };
  minusBeats = () => {
    if (this.state.beatsPerMeasure > 2) {
      this.setState({ beatsPerMeasure: this.state.beatsPerMeasure - 1 });
    }
  };
  addBeats = () => {
    if (this.state.beatsPerMeasure < 12) {
      this.setState({ beatsPerMeasure: this.state.beatsPerMeasure + 1 });
    }
  };
  createBeats = () => {
    const { beatsPerMeasure, count } = this.state;
    let beats = [];
    for (var i = 0; i < beatsPerMeasure; i++) {
      if ((i + 1) % beatsPerMeasure === count) {
        beats.push(<i key={i} className="fas fa-circle"></i>);
      } else {
        beats.push(<i key={i} className="far fa-circle"></i>);
      }
    }
    return beats;
  };

  render() {
    // references variables from this.state
    const { playing, bpm, beatsPerMeasure, time } = this.state;

    return (
      <div className="metronome">
        <h1>React App Metronome</h1>
        <div className="bpm-slider">
          <div>{bpm} BPM</div>
          <button onClick={this.minusBpm}>-</button>
          <input
            type="range"
            min="20"
            max="260"
            value={bpm}
            onChange={this.handleSlider}
          />
          <button onClick={this.addBpm}>+</button>
        </div>
        <div>{this.createBeats()}</div>
        <button className="startstop" onClick={this.startStop}>
          {playing ? "STOP" : "START"}
        </button>
        <div className="input">
          <div>
            <input
              type="checkbox"
              checked={this.state.stressFirstBeat}
              onChange={this.handleStressChange}
            />
            Stress First Beat
          </div>
          <div className="beatsNum">
            <button onClick={this.minusBeats}>-</button>
            {beatsPerMeasure}
            <button onClick={this.addBeats}>+</button>
          </div>
        </div>
        <div className="input">
          <div>
            <input
              type="checkbox"
              checked={this.state.timer}
              onChange={this.handleTimeChange}
            />
            Timer
          </div>
          <div className="beatsNum">
            <button onClick={this.minusTime}>-</button>
            {time}
            <button onClick={this.addTime}>+</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Metronome;
