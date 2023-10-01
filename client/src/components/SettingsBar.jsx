import toolState from '../store/toolState'
import '../styles/toolbar.scss'

const SettingsBar = () => {
  return (
    <div className='settingsbar'>
      <label htmlFor="line-width" style={{margin: '0 10px'}}>Line width</label>
      <input 
        onChange={e => toolState.setLineWidth(e.target.value)}
        style={{margin: '0 10px'}} 
        id='line-width' type='number' 
        defaultValue={1} min={1} max={50}/>
      <label htmlFor="stroke-color">Stroke color</label>
      <input onChange={e => toolState.setStrokeStyle(e.target.value)} 
      style={{margin: '0 10px'}} 
      id='stroke-color' 
      type="color" />
    </div>
  )
}

export default SettingsBar