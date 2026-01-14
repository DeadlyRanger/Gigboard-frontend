import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Container from "../components/Container";

const MyBids = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/bids/my-bids")
      .then(res => {
        const rawBids = res.data.bids || [];
        // ✅ SORT BY DATE (Newest first)
        const sortedBids = rawBids.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setBids(sortedBids);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getStatusStyles = (status) => {
    switch (status) {
      case 'hired':
      case 'assigned':
        return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50';
      default:
        return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50';
    }
  };

  return (
    <Container>
      <div className="max-w-5xl mx-auto py-12 px-4 transition-colors duration-300">
        <header className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            My Proposals
          </h2>
          <p className="text-gray-500 dark:text-slate-400 mt-3 text-lg leading-relaxed">
            Track the status of the projects you've applied for and manage your incoming offers.
          </p>
        </header>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-28 bg-gray-100 dark:bg-slate-800/50 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : bids.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-gray-100 dark:border-slate-800 transition-all">
            <div className="mb-4 text-gray-300 dark:text-slate-700 flex justify-center">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <p className="text-xl text-gray-500 dark:text-slate-400 font-medium tracking-tight">You haven't placed any bids yet.</p>
            <Link to="/" className="text-indigo-600 dark:text-indigo-400 font-bold mt-4 inline-block hover:scale-105 transition-transform">
              Browse available gigs →
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-2xl shadow-indigo-100/10 dark:shadow-none rounded-[2rem] transition-all">
            <ul className="divide-y divide-gray-50 dark:divide-slate-800">
              {bids.map((bid) => (
                <li key={bid._id} className="p-8 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {bid.gigId?.title || "Unknown Gig"}
                        </h3>
                        {/* ✅ DATE BADGE */}
                        <span className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest">
                          {new Date(bid.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${getStatusStyles(bid.status)}`}>
                          {bid.status}
                        </span>
                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                          My Bid: ${bid.amount || '---'}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-slate-500 font-medium">
                          Client Budget: ${bid.gigId?.budget || '--'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Link 
                        to={`/gigs/${bid.gigId?._id}`}
                        className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-gray-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95 text-center"
                      >
                        View Project
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Container>
  );
};

export default MyBids;