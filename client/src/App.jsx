import SettingsBar from './components/SettingsBar'
import ToolBar from './components/ToolBar'
import Canvas from './components/Canvas'
import './styles/app.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

const App = () => {

  return (
    <BrowserRouter>
    <div className='app'>
      <Routes>
        <Route path='/:id' element={
          <>
            <ToolBar />
            <SettingsBar />
            <Canvas />
          </>
        }/>
          
        <Route path='/' 
        element={<Navigate to={`f${(+new Date).toString(16)}`} />}/>
        
      </Routes>
    </div>

    </BrowserRouter>
  )
}

export default App
