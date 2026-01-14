import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import Container from "../components/Container";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/auth/dashboard-stats"); // Update path to your route
        setStats(res.data.stats);
      } catch (err) {
        console.error("Dashboard error", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchStats();
  }, [user]);

  const StatCard = ({ title, value, color }) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
      <p className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-2">{title}</p>
      <p className={`text-4xl font-black ${color} dark:brightness-110 tracking-tighter`}>{value}</p>
    </div>
  );

  return (
    <Container>
      <div className="max-w-6xl mx-auto py-12 px-4">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Welcome back, {user?.name.split(" ")[0]}! 👋
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-2 text-lg">
            Here is what is happening with your projects today.
          </p>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-100 dark:bg-slate-800 rounded-3xl" />)}
          </div>
        ) : (
          <div className="space-y-10">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Active Gigs" value={stats?.activeGigs} color="text-indigo-600" />
              <StatCard title="Total Spent" value={`$${stats?.totalSpent}`} color="text-emerald-600" />
              <StatCard title="Proposals" value={stats?.proposalsSent} color="text-blue-600" />
              <StatCard title="Gigs Won" value={stats?.gigsWon} color="text-amber-600" />
            </div>

            {/* Quick Actions Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-xl shadow-indigo-500/20">
                <h2 className="text-3xl font-black mb-4">Need help?</h2>
                <p className="text-indigo-100 mb-8 leading-relaxed">Post a new gig today and find the top talent ready to start working on your project.</p>
                <Link to="/create-gig" className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black transition-transform hover:scale-105 active:scale-95">
                  Post a Gig
                </Link>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-sm flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">Work is waiting</h2>
                  <p className="text-gray-500 dark:text-slate-400 mb-8 leading-relaxed">Browse the latest available gigs and submit your best proposals.</p>
                </div>
                <Link to="/" className="inline-block bg-gray-900 dark:bg-slate-800 text-white text-center py-4 rounded-2xl font-black hover:bg-black transition-all">
                  Find Work
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default Dashboard;