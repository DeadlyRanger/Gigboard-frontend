import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Container from "../components/Container";

const GigBids = () => {
  const { gigId } = useParams();
  const navigate = useNavigate();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await api.get(`/bids/${gigId}`);
        setBids(res.data.bids || []);
      } catch (err) {
        console.error("Error fetching bids", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBids();
  }, [gigId]);

  const hire = async (bidId) => {
    try {
      await api.patch(`/bids/${bidId}/hire`);
      alert("Freelancer hired successfully!");
      navigate("/my-gigs");
    } catch (err) {
      alert("Failed to hire freelancer");
    }
  };

  return (
    <Container>
      <div className="max-w-4xl mx-auto py-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Bids Received</h2>
            <p className="text-gray-500 mt-1">Review proposals and select the best freelancer for your gig.</p>
          </div>
          <span className="bg-indigo-50 text-indigo-700 px-4 py-1 rounded-full text-sm font-semibold border border-indigo-100">
            {bids.length} {bids.length === 1 ? 'Bid' : 'Bids'}
          </span>
        </header>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading bids...</div>
        ) : bids.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500">No bids received yet for this gig.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {bids.map((bid) => (
              <div
                key={bid._id}
                className="group relative bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {bid.freelancerId.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{bid.freelancerId.name}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          bid.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'
                        }`}>
                          {bid.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-4 italic">
                      "{bid.message}"
                    </p>
                  </div>

                  <div className="flex items-center md:items-start">
                    {bid.status === "pending" && (
                      <button
                        onClick={() => hire(bid._id)}
                        className="w-full md:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-100 transition-all transform active:scale-95"
                      >
                        Hire & Assign
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default GigBids;