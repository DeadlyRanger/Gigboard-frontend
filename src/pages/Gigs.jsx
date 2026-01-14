import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Container from "../components/Container";

const Gigs = () => {
  const [gigs, setGigs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    try {
      const res = await api.get("/gigs");
      setGigs(res.data.gigs || []);
    } catch (err) {
      console.error("Failed to fetch gigs", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 FRONTEND SEARCH
  const filteredGigs = gigs.filter((gig) =>
    `${gig.title} ${gig.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <Container>
      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Header & Search Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-3 transition-colors">
              Available Gigs
            </h2>
            <p className="text-gray-600 dark:text-slate-400 text-lg transition-colors">
              Discover your next project and start collaborating today.
            </p>
          </div>

          <div className="relative group flex-shrink-0">
            <input
              type="text"
              placeholder="Search by title or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-80 pl-12 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none shadow-sm"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 bg-gray-100 dark:bg-slate-800/50 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : filteredGigs.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-slate-900 border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-3xl transition-colors">
            <p className="text-xl text-gray-500 dark:text-slate-400 font-medium">No projects match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGigs.map((gig) => (
              <div
                key={gig._id}
                className="group flex flex-col bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-7 rounded-3xl shadow-sm hover:shadow-xl dark:hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                      Open Project
                    </span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold ml-auto">
                      ${gig.budget || "Flexible"}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {gig.title}
                  </h3>
                  
                  <p className="text-gray-500 dark:text-slate-400 text-sm line-clamp-3 mb-6 leading-relaxed">
                    {gig.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-50 dark:border-slate-800 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-300">
                      {gig.ownerId?.name?.charAt(0).toUpperCase() || "C"}
                    </div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                      {gig.ownerId?.name || "Client"}
                    </span>
                  </div>
                  
                  <Link
                    to={`/gigs/${gig._id}`}
                    className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 group/link transition-all"
                  >
                    View Details
                    <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default Gigs;