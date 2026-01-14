import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import Container from "../components/Container";

const GigDetails = () => {
  const { gigId } = useParams();
  const { user } = useContext(AuthContext);

  const [gig, setGig] = useState(null);
  const [proposal, setProposal] = useState("");
  const [amount, setAmount] = useState("");
  const [hasBid, setHasBid] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // ✅ NEW STATES: Terms Management
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gigRes = await api.get(`/gigs/${gigId}`);
        if (gigRes.data.success) {
          setGig(gigRes.data.gig);
        }

        if (user) {
          const bidsRes = await api.get("/bids/my-bids");
          const alreadyBid = bidsRes.data.bids.some(
            (b) => b.gigId?._id === gigId
          );
          setHasBid(alreadyBid);
        }
      } catch (err) {
        console.error("Error fetching gig details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [gigId, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!gig) {
    return (
      <Container>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold dark:text-white">Gig not found</h2>
          <Link to="/" className="text-indigo-600 mt-4 inline-block font-medium">Return to Browse</Link>
        </div>
      </Container>
    );
  }

  const isOwner = gig.ownerId?._id === user?.id;

  const placeBid = async () => {
    if (!amount || !proposal) {
      alert("Please fill in all fields.");
      return;
    }

    if (!agreedToTerms) {
      alert("You must agree to the Marketplace Terms & Conditions first.");
      return;
    }

    try {
      await api.post("/bids", {
        gigId,
        message: proposal,
        amount: Number(amount),
      });
      alert("Success! Your proposal has been sent.");
      setHasBid(true);
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting bid.");
    }
  };

  return (
    <Container>
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm font-medium text-gray-500 dark:text-slate-400">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Marketplace</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-slate-200 truncate">{gig.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                  gig.status === 'open' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                }`}>
                  {gig.status}
                </span>
                <span className="text-gray-400 text-xs tracking-wide">Posted {new Date(gig.createdAt).toLocaleDateString()}</span>
              </div>
              <h1 className="text-4xl font-black text-gray-900 dark:text-white leading-tight mb-6">{gig.title}</h1>
              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Project Details</h3>
                <p className="text-gray-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap text-lg">{gig.description}</p>
              </div>
              <div className="mt-10 pt-8 border-t border-gray-100 dark:border-slate-800 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                  {gig.ownerId?.name?.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Posted By</p>
                  <p className="text-gray-900 dark:text-white font-bold text-lg">{gig.ownerId?.name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl shadow-indigo-500/5">
                <div className="mb-8">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Project Budget</p>
                  <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400">${gig.budget}</div>
                </div>

                {!user ? (
                  <div className="text-center p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl">
                    <p className="dark:text-slate-300 mb-4">Login to submit a proposal</p>
                    <Link to="/login" className="block w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">Sign In</Link>
                  </div>
                ) : gig.status === "assigned" ? (
                  <div className={`p-6 border rounded-2xl text-center ${gig.assignedTo?._id === user.id ? "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/50" : "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/50"}`}>
                    <p className="font-bold text-xl">{gig.assignedTo?._id === user.id ? "You're Hired!" : "Assigned"}</p>
                  </div>
                ) : isOwner ? (
                  <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-2xl text-center">
                    <p className="text-blue-700 dark:text-blue-400 font-bold mb-2 text-lg">You Own This Gig</p>
                    <Link to="/my-gigs" className="text-sm text-blue-600 dark:text-blue-300 underline">View Applicants</Link>
                  </div>
                ) : hasBid ? (
                  <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/50 rounded-2xl text-center">
                    <p className="text-green-700 dark:text-green-400 font-bold text-xl">Applied!</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-4 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl dark:text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Your Quote ($)"
                    />
                    <textarea
                      value={proposal}
                      onChange={(e) => setProposal(e.target.value)}
                      className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl dark:text-white text-sm min-h-[140px] outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Explain your proposal..."
                    />

                    {/* ✅ Terms & Conditions Checkbox */}
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 text-indigo-600 rounded cursor-pointer"
                      />
                      <label htmlFor="terms" className="text-[11px] text-gray-500 dark:text-slate-400 leading-tight">
                        I agree to the <button type="button" onClick={() => setShowTermsModal(true)} className="text-indigo-600 dark:text-indigo-400 font-bold underline">Marketplace Agreement</button>
                      </label>
                    </div>

                    <button
                      onClick={placeBid}
                      disabled={!agreedToTerms}
                      className={`w-full py-5 rounded-2xl font-black text-lg transition-all ${
                        agreedToTerms ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/20" : "bg-gray-200 dark:bg-slate-800 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Apply Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ✅ TERMS MODAL POPUP */}
        {showTermsModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800 animate-in zoom-in-95">
              <div className="p-8 border-b border-gray-50 dark:border-slate-800 flex justify-between items-center">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Marketplace Service Agreement</h2>
                <button onClick={() => setShowTermsModal(false)} className="text-gray-400 hover:text-white transition-colors">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="p-8 max-h-[50vh] overflow-y-auto space-y-6 text-sm text-gray-600 dark:text-slate-400 leading-relaxed custom-scrollbar">
                <section>
                  <h4 className="font-bold text-gray-900 dark:text-slate-200 mb-1">1. Anti-Circumvention Policy</h4>
                  <p>All communication and payments must be handled through GigBoard. Taking business off-platform is a direct violation of our security standards.</p>
                </section>
                <section>
                  <h4 className="font-bold text-gray-900 dark:text-slate-200 mb-1">2. Payment & Escrow</h4>
                  <p>Funds are released only after the client approves the final work. Bids are considered binding legal offers for the project price.</p>
                </section>
                <section>
                  <h4 className="font-bold text-gray-900 dark:text-slate-200 mb-1">3. Deliverable Ownership</h4>
                  <p>Upon full payment, the client owns the copyright of the deliverables unless stated otherwise in the project description.</p>
                </section>
                <section>
                   <h4 className="font-bold text-gray-900 dark:text-slate-200 mb-1">4. Dispute & Mediation</h4>
                   <p>In case of conflict, GigBoard provides mediation services. Users agree to provide evidence for all disputes within 48 hours of a claim.</p>
                </section>
              </div>
              <div className="p-8 bg-gray-50 dark:bg-slate-800/30 flex justify-end">
                <button 
                  onClick={() => { setAgreedToTerms(true); setShowTermsModal(false); }}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all active:scale-95"
                >
                  I Accept
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default GigDetails;