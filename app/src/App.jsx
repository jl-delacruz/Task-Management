import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/signIn';
import SignUp from './pages/signUp';
import Dashboard from './pages/dashboard';
import TaskTrash from './pages/taskTrash';


function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/taskTrash" element={<TaskTrash />} />
    </Routes>
  );
}

export default App;