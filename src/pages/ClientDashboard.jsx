import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Container from "../components/Container";

const ClientDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const res = await api.get("/auth/client-dashboard"); // Update to your route
        setData(res.data.data);
      } catch (err) {
        console.error("Client Dashboard error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClientData();
  }, []);

  if (loading) return <div className="p-20 text-center dark:text-white">Loading Client Workspace...</div>;

  return (
    <Container>
      <div className="max-w-6xl mx-auto py-12 px-4">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">Employer Console</h1>
            <p className="text-gray-500 dark:text-slate-400 mt-2">Manage your posted gigs and talent acquisitions.</p>
          </div>
          <Link to="/create-gig" className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all">
            Post New Gig
          </Link>
        </header>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm">
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Total Investment</p>
            <p className="text-4xl font-black text-emerald-600">${data?.stats.totalInvestment}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm">
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Active Gigs</p>
            <p className="text-4xl font-black text-indigo-600">{data?.stats.activeProjects}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm">
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Hired/Completed</p>
            <p className="text-4xl font-black text-gray-900 dark:text-white">{data?.stats.completedProjects}</p>
          </div>
        </div>

        {/* Project List */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-gray-50 dark:border-slate-800">
            <h2 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter">Your Postings</h2>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-slate-800">
            {data?.projects.map(gig => (
              <div key={gig._id} className="p-8 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{gig.title}</h3>
                  <div className="flex gap-3 items-center">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                      gig.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {gig.status}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">Budget: ${gig.budget}</span>
                  </div>
                </div>
                <Link 
                  to={gig.status === 'open' ? `/gigs/${gig._id}/bids` : `/gigs/${gig._id}`}
                  className="px-5 py-2 text-sm font-bold border border-gray-200 dark:border-slate-700 rounded-xl dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700 transition-all"
                >
                  {gig.status === 'open' ? "View Applicants" : "View Details"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ClientDashboard;