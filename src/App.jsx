import { Navigate, Outlet, Route, RouterProvider, Routes, createBrowserRouter } from 'react-router-dom';
import './App.scss'
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './components/sidebar/Sidebar';
import Topbar from './components/topbar/Topbar';
import Dashboard from './pages/dashboard/Dashboard';
import Blog from './pages/blog/Blog';
import Job from './pages/job/Job';
import Team from './pages/team/Team';
import Gallery from './pages/gallery/Gallery';
import { useSelector } from 'react-redux';
import BlogInput from './components/blogInput/BlogInput';
import JobInput from './components/jobInput/JobInput';
import EditJob from './components/editJob/EditJob';
import EditBlog from './components/editBlog/EditBlog';
import TeamAdd from './components/teamAdd/TeamAdd';
import Login from './pages/login/Login';
import About from './pages/about/About';
import EditAbout from './components/editAbout/EditAbout';
import CreateAbout from './components/createAbout/CreateAbout';
import CreatePractice from './components/createPractice/CreatePractice';
import EditPractice from './components/editPractice/EditPractice';
import TeamEdit from './components/teamEdit/TeamEdit';
import News from './pages/news/News';
import CreateNews from './components/createNews/CreateNews';
import EditNews from './components/editNews/EditNews';
import LegalServices from './pages/legalServices/LegalServices';
import CreateServices from './components/createService/CreateServices';
import EditServices from './components/editServices/EditServices';

function App() {
  const { navStatus } = useSelector(state => state.nav);
  const { admin } = useSelector(state => state.admin);

  const Verify = ({ children }) => {
    if (admin) {
      return children
    } else {
      return <Navigate to={'/login'} />
    }
  }

  const Layout = () => {
    return (
      <div className='app'>
        <Verify>
          <div className="app-topbar"><Topbar /></div>
          <div className="app-home">
            <div className={`app-home-sidebar ${navStatus ? 'active' : ''}`}><Sidebar /></div>
            <div className="app-home-outlet"><Outlet /></div>
          </div>
        </Verify>
      </div>
    );
  };



  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="about" element={<About />} />
          <Route path="about/create" element={<CreateAbout />} />
          <Route path="about/:aboutId" element={<EditAbout />} />
          <Route path="services" element={<LegalServices />} />
          <Route path="services/create" element={<CreateServices />} />
          <Route path="services/:id" element={<EditServices />} />
          <Route path="blog" element={<Blog />} />
          <Route path="news" element={<News />} />
          <Route path="news/create" element={<CreateNews />} />
          <Route path="news/:id" element={<EditNews />} />
          <Route path="blog/create" element={<BlogInput />} />
          <Route path="blog/:blogId" element={<EditBlog />} />
          <Route path="job" element={<Job />} />
          <Route path="job/create" element={<JobInput />} />
          <Route path="job/:jobId" element={<EditJob />} />
          <Route path="team" element={<Team />} />
          <Route path="team/add" element={<TeamAdd />} />
          <Route path="team/edit/:id" element={<TeamEdit />} />
          <Route path="gallery" element={<Gallery />} />
        </Route>
        <Route path="/login" element={admin ? <Navigate to={'/'} /> : <Login />} />
      </Routes>
    </>
  )
}

export default App;
