import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from "./pages/LandingPage"
import PredictPage from "./pages/PredictPage"
import AnalysisPage from "./pages/AnalysisPage"
import ModelManagementPage from "./pages/ModelManagementPage"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/predict" element={<PredictPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/model-management" element={<ModelManagementPage />} />
      </Routes>
    </Router>
  )
}
