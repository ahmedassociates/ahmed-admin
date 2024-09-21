import { useEffect, useState } from 'react';
import './Dashboard.scss';
import { axiosReq } from '../../utils/axiosReq';

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [teams, setTeams] = useState([]);
  useEffect(() => {
    const getAll = async () => {
      try {
        axiosReq.get('/blog').then(res => setBlogs(res.data));
        axiosReq.get('/job').then(res => setJobs(res.data));
        axiosReq.get('/team').then(res => setTeams(res.data));
      } catch (error) {
        console.log(error)
      }
    }
    getAll();
  }, [])

  return (
    <div className="dashboard">
      <div className="dashboard-wrapper">
        <div className="total"><h4> Total Blog:</h4>{blogs.length}</div>
        <div className="total"><h4>Total Job:</h4>{jobs.length}</div>
        <div className="total"><h4>Total Team:</h4>{teams.length}</div>
      </div>
    </div>
  )
}

export default Dashboard