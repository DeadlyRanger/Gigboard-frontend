import { useEffect, useState } from "react";
import api from "../api/axios";
import Container from "../components/Container";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/notifications")
      .then(res => {
        setNotifications(res.data.notifications || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <Container>
      <div className="max-w-2xl mx-auto py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Notifications</h2>
            <p className="text-gray-500 mt-1">Stay updated on your gig activity and bids.</p>
          </div>
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
            {notifications.length} Total
          </span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-16 bg-gray-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-3xl">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No new notifications</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 shadow-xl shadow-indigo-100/20 rounded-3xl overflow-hidden">
            <div className="divide-y divide-gray-50">
              {notifications.map((n) => (
                <div 
                  key={n._id} 
                  className="p-5 hover:bg-indigo-50/30 transition-colors flex items-start gap-4"
                >
                  {/* Notification Dot */}
                  <div className="mt-1.5">
                    <div className="h-2.5 w-2.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                      {n.message}
                    </p>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 block">
                      Recently
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default Notifications;