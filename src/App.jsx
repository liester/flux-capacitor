import { useState } from 'react'
import './App.css'

const AudioCard = ({inputs, output}) => {

  return (
      <div style={{display: 'flex', flexDirection:'column', alignItems:'center', border: 'solid gray 2px', padding: 10}}>
        <div>{output.label}</div>
        <audio controls id={`audio-in-${output.label}`}>
          <source src="https://dsqqu7oxq6o1v.cloudfront.net/1360818-aD1hqjqBm6.mp3"  type="audio/mp3"/>
        </audio>
        {inputs.map(input => {
          return <div onClick={async ()=> {
            const audioElement = document.getElementById(`audio-in-${output.label}`)
            audioElement.src = input;
            audioElement.setSinkId(output.deviceId)
            audioElement.play();
          }}
          style={{border: "solid white 2px", padding: 2, borderRadius: 4, marginBottom: 10, cursor: 'pointer'}}>{input}</div>
        })}
      </div>
  )
}

function App() {

  const inputs = [
      'https://dsqqu7oxq6o1v.cloudfront.net/1360818-aD1hqjqBm6.mp3',
      'https://dsqqu7oxq6o1v.cloudfront.net/preview-158050-pSu6py7Hfd.mp3',
      'https://dsqqu7oxq6o1v.cloudfront.net/1328871-bG3NuNFOKK.mp3',
      'https://dsqqu7oxq6o1v.cloudfront.net/1360818-aD1hqjqBm6.mp3',
  ]

  const [outputs, setOutputs] = useState([])
  navigator.mediaDevices.getUserMedia({audio: true}).then(s=>{
    s.getTracks().forEach(x=>x.stop()); //stop mic use because we need only outputs
    navigator.mediaDevices.enumerateDevices().then(o=>{
      const outputs = o.filter(({ kind, deviceId }) => kind === 'audiooutput' && deviceId !== 'default' && deviceId !== 'communications');
      setOutputs(outputs)
    });
  }).catch(e=>console.log(e));

  const play = () => {
    const audioElement = document.getElementById('audio-in')
    audioElement.play();
  }

  const pause = () => {
    const audioElement = document.getElementById('audio-in')
    audioElement.pause();
  }


  const switchToDevice = async () => {
    const selectElement = document.getElementById('selected-device');
    console.log('selected device id: '+selectElement.selectedOptions[0].dataset.deviceId)
    const deviceId = selectElement.selectedOptions[0].dataset.deviceId
    const audioElement = document.getElementById('audio-in')
    await audioElement.setSinkId(deviceId);
    console.log(`Audio is being played on ${deviceId}`);
  }

  return (
    <div>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        Outputs
        <select id={'selected-device'}>
        {outputs.map(output => {
          return <option data-device-id={output.deviceId} key={output.label}>{output.label}</option>
        })}
        </select>
        <div style={{display: 'flex', flexDirection: "column", alignItems: 'center', paddingTop: 20}}>
          <audio controls id={'audio-in'}>
            <source src="https://dsqqu7oxq6o1v.cloudfront.net/1360818-aD1hqjqBm6.mp3"  type="audio/mp3"/>
          </audio>
        <button onClick={play}>PLAY</button>
        <button onClick={pause}>PAUSE</button>
        <button onClick={()=> switchToDevice()}>Switch</button>
        </div>
      </div>
      <div>
        {outputs.map(output => {
          return <AudioCard key={output.label} inputs={inputs} output={output}/>
        })}
      </div>
    </div>
  )
}

export default App
