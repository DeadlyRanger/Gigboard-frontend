import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Container from "../components/Container";

const CreateGig = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: ""
  });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description) {
      alert("Title and description required");
      return;
    }

    setLoading(true);
    try {
      await api.post("/gigs", {
        title: form.title,
        description: form.description,
        budget: Number(form.budget)
      });
      navigate("/my-gigs");
    } catch (err) {
      alert(err.response?.data?.message || "Create gig failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500";

  return (
    <Container>
      <div className="max-w-2xl mx-auto py-12 px-4">
        {/* Header Section */}
        <div className="mb-10 text-center md:text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Post a New Gig
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-slate-400 leading-relaxed">
            Fill in the details below to find the perfect professional for your project.
          </p>
        </div>

        {/* Form Card */}
        <form 
          onSubmit={submit} 
          className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-2xl shadow-indigo-100/20 dark:shadow-none rounded-3xl p-8 md:p-10 space-y-8 animate-in fade-in zoom-in-95 duration-500"
        >
          {/* Title Input */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider ml-1">
              Gig Title
            </label>
            <input
              className={inputClasses}
              placeholder="e.g. Build a React Landing Page"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          {/* Description Textarea */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider ml-1">
              Description
            </label>
            <textarea
              rows="5"
              className={inputClasses}
              placeholder="Describe the project requirements in detail..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {/* Budget Input */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider ml-1">
              Budget ($)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400 font-bold">$</span>
              <input
                type="number"
                className={`${inputClasses} pl-10`}
                placeholder="0.00"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
              />
            </div>
          </div>

          {/* Action Button */}
          <button 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Create Gig"
            )}
          </button>
        </form>
      </div>
    </Container>
  );
};

export default CreateGig;