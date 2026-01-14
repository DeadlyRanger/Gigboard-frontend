import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import Container from "../components/Container";

const MyGigs = () => {
  const { user } = useContext(AuthContext);
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyGigs = async () => {
      try {
        const res = await api.get("/gigs/my-gigs");

        // 🔥 SAFE NORMALIZATION
        const gigsData =
          res.data?.gigs ||
          (Array.isArray(res.data) ? res.data : []);

        setGigs(gigsData);
      } catch (err) {
        console.error(
          "Error fetching your gigs:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };
    
    if (user) fetchMyGigs();
  }, [user]);

  return (
    <Container>
      <div className="max-w-5xl mx-auto py-12 px-4">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              Manage Your Gigs
            </h2>
            <p className="text-gray-500 dark:text-slate-400 mt-2">
              Review proposals and manage your {gigs.length} active postings.
            </p>
          </div>
          <Link
            to="/create-gig"
            className="inline-flex items-center px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 transition-all active:scale-95"
          >
            + Post New Gig
          </Link>
        </header>

        {loading ? (
          <div className="space-y-6">
            {[1, 2].map((n) => (
              <div key={n} className="h-32 bg-gray-100 dark:bg-slate-800 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : gigs.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-3xl">
            <p className="text-gray-500 dark:text-slate-400 text-lg font-medium">
              You haven't posted any gigs yet.
            </p>
            <Link to="/create-gig" className="mt-4 inline-block text-indigo-600 font-bold">
              Start by creating a gig →
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {gigs.map((gig) => (
              <div
                key={gig._id}
                className="group bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      gig.status === 'open' 
                        ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30' 
                        : 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30'
                    }`}>
                      {gig.status}
                    </span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                      Budget: ${gig.budget}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
                    {gig.title}
                  </h3>
                </div>

                <div className="flex items-center gap-6">
                  {gig.status === "assigned" ? (
                    /* ✅ SHOW ASSIGNED USER UI */
                    <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 px-5 py-3 rounded-2xl border border-blue-100 dark:border-blue-800/50">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase font-black text-blue-500 tracking-wider">Assigned To</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {gig.assignedTo?.name || "Freelancer"}
                        </span>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                        {gig.assignedTo?.name?.charAt(0).toUpperCase() || "F"}
                      </div>
                    </div>
                  ) : (
                    /* 🔍 SHOW PROPOSALS COUNT & VIEW BUTTON */
                    <>
                      <div className="text-right hidden sm:block">
                        <p className="text-lg font-black text-gray-900 dark:text-white">
                          {gig.bidCount || 0}
                        </p>
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                          Proposals
                        </p>
                      </div>
                      <Link
                        to={`/gigs/${gig._id}/bids`}
                        className="px-6 py-3 bg-gray-900 dark:bg-slate-800 text-white text-sm font-bold rounded-xl hover:bg-black dark:hover:bg-slate-700 transition-all shadow-md active:scale-95"
                      >
                        View Bids
                      </Link>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default MyGigs;