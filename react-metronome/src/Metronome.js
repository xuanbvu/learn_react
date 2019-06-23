import React, {Component} from "react";
import "./Metronome.css";
import click1 from "./click1.wav";
import click2 from "./click2.wav";

class Metronome extends Component {
    constructor(props) {
        super(props);

        // initializes states
        this.state = {
            playing: false,
            count: 0,
            bpm: 100,
            input_bpm: this.bpm,
            beatsPerMeasure: 4,
            input_beats:  this.beatsPerMeasure
        }

        // creates Audio objects with webpack files
        this.click1 = new Audio(click1);
        this.click2 = new Audio(click2);
    }

    handleBpmChange = (new_bpm) => {
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
                bpm
            });
        }
        // if not, just update bpm
        else {
            this.setState({bpm});
        }
    }
    startStop = () => {
        if (this.state.playing) {
            // stop and clear the timer
            clearInterval(this.timer);
            this.setState({
                playing: false
            });
        }
        else {
            // start a timer with the current bpm
            this.timer = setInterval(
                this.playClick, 
                (60 / this.state.bpm) * 1000
            );
            this.setState(
                {
                    count: 0, 
                    playing: true
                }, 
                // play a click immediately (after setState finishes)
                this.playClick
            );
        }
    }
    playClick = () => {
        const {count, beatsPerMeasure} = this.state;

        // first beat will have different sound than the others
        if (count % beatsPerMeasure == 0) {
            this.click2.play();
        }
        else {
            this.click1.play();
        }

        // keep track of which beat we're on
        this.setState(state => ({
            count: (state.count + 1) % state.beatsPerMeasure
        }));
    }
    handleChange_beats = (event) => {
        this.input_beats = event.target.value;
    }
    handleSubmit_beats = (event) => {
        event.preventDefault();
        this.setState({
            beatsPerMeasure: this.input_beats
        });
        // do you want to reset?
        event.target.reset();
    }
    handleChange_bpm = (event) => {
        this.input_bpm = event.target.value;
    }
    handleSubmit_bpm = (event) => {
        event.preventDefault();
        this.handleBpmChange(this.input_bpm);
        // do you want to reset?
        event.target.reset();
    }
    handleSlider = (event) => {
        this.handleBpmChange(event.target.value);
    }

    render() {
        // references variables from this.state
        const {playing, bpm} = this.state;

        return (
            <div className="metronome">
                <h1>React App Metronome</h1>
                <div className="bpm-slider">
                    <div>{bpm} BPM</div>
                    <input type="range" min="60" max="240" value={bpm} onChange={this.handleSlider}/>
                </div>
                <form className="parameters" onSubmit={this.handleSubmit_bpm}>
                    Enter BPM (60 to 240): 
                    <input type="number" min="60" max="240" onChange={this.handleChange_bpm}/>
                    <input type="submit" value="Submit"/>
                </form>
                <form className="parameters" onSubmit={this.handleSubmit_beats}>
                    Enter number of beats: 
                    <input type="number" onChange={this.handleChange_beats}/>
                    <input type="submit" value="Submit"/>
                </form>
                <button className="startstop"onClick={this.startStop}>{playing ? "STOP" : "START"}</button>
            </div>
        );
    }
}

export default Metronome;