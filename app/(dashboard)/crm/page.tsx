"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Dialog } from "@/components/ui/Dialog";
import { toast } from "sonner";
import { 
  Users, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Instagram, 
  Phone, 
  Mail, 
  Calendar,
  Layers,
  Sparkles
} from "lucide-react";

interface Contact {
  id: string;
  name: string;
  handle: string | null;
  email: string | null;
  status: string; // NEW, INTERESTED, NEGOTIATING, CLOSED
  notes: string | null;
  lastInteraction: string;
  createdAt: string;
}

export default function CRMPage() {
  const [contacts, setContacts] = React.useState<Contact[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  // Create Contact Form States
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [handle, setHandle] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState("NEW");
  const [notes, setNotes] = React.useState("");
  const [formLoading, setFormLoading] = React.useState(false);

  // Follow-up generator states
  const [isFollowupOpen, setIsFollowupOpen] = React.useState(false);
  const [followupLoading, setFollowupLoading] = React.useState(false);
  const [followupResult, setFollowupResult] = React.useState<any>(null);

  const handleTriggerFollowup = async (contactId: string) => {
    setIsFollowupOpen(true);
    setFollowupLoading(true);
    setFollowupResult(null);

    try {
      const res = await fetch("/api/ai/followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactId }),
      });

      const data = await res.json();
      if (res.ok) {
        setFollowupResult(data);
      } else {
        toast.error(data.details || "Failed to generate follow-up.");
        setIsFollowupOpen(false);
      }
    } catch (e) {
      toast.error("Network error generating follow-up.");
      setIsFollowupOpen(false);
    } finally {
      setFollowupLoading(false);
    }
  };

  // Fetch all CRM contacts on mount
  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/crm/contact");
      const data = await res.json();
      if (res.ok && data.contacts) {
        setContacts(data.contacts);
      } else {
        toast.error("Failed to load Brand Opportunities.");
      }
    } catch (e) {
      toast.error("Network error loading Brand Opportunities.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchContacts();
  }, []);

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Contact or Brand name is required.");
      return;
    }

    setFormLoading(true);
    try {
      const response = await fetch("/api/crm/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, handle, email, status, notes }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to add opportunity.");

      toast.success("Brand opportunity saved successfully!");
      setIsAddOpen(false);
      
      // Clear fields
      setName("");
      setHandle("");
      setEmail("");
      setStatus("NEW");
      setNotes("");
      
      fetchContacts();
    } catch (err: any) {
      toast.error(err.message || "Failed to create opportunity.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch("/api/crm/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");
      
      toast.success(`Opportunity moved to ${newStatus}!`);
      fetchContacts();
    } catch (e) {
      toast.error("Failed to update lead status.");
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm("Are you sure you want to delete this brand opportunity?")) return;

    try {
      const response = await fetch(`/api/crm/contact?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete opportunity");

      toast.success("Opportunity deleted successfully.");
      fetchContacts();
    } catch (e) {
      toast.error("Failed to delete opportunity.");
    }
  };

  // Group contacts by status
  const columns = [
    { key: "NEW", title: "📥 New Opportunities", color: "bg-blue-500/10 text-blue-600 border-blue-200" },
    { key: "INTERESTED", title: "⭐️ Interested", color: "bg-violet-500/10 text-violet-600 border-violet-200" },
    { key: "NEGOTIATING", title: "💬 Negotiating", color: "bg-amber-500/10 text-amber-600 border-amber-200" },
    { key: "CLOSED", title: "🎉 Collaborations Closed", color: "bg-emerald-500/10 text-emerald-600 border-emerald-200" }
  ];

  const getNextStage = (current: string) => {
    if (current === "NEW") return "INTERESTED";
    if (current === "INTERESTED") return "NEGOTIATING";
    if (current === "NEGOTIATING") return "CLOSED";
    return null;
  };

  return (
    <div className="space-y-8 text-[#334155] font-sans">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-syne text-[#334155] tracking-wide flex items-center gap-2">
            Brand Opportunities
            <Users className="h-7 w-7 text-indigo-500" />
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Track collaboration opportunities, manage active sponsorships, and organize campaign negotiations in one place.
          </p>
        </div>
        <div>
          <Button 
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 py-3 px-5 text-sm font-bold font-syne shadow-md shadow-indigo-600/10 cursor-pointer bg-gradient-to-r from-[#A78BFA] to-[#F9A8D4] border-0 text-white"
          >
            <Plus className="h-4.5 w-4.5" />
            Add Opportunity
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-white border border-slate-200 min-h-[400px] p-4 space-y-4">
              <div className="h-6 bg-slate-100 rounded w-1/2" />
              <div className="h-32 bg-slate-50 rounded-xl" />
            </Card>
          ))}
        </div>
      ) : contacts.length === 0 ? (
        /* Stunning Premium Opportunities Empty State */
        <Card className="bg-white border-slate-200 border-dashed border-2 p-12 flex flex-col items-center justify-center text-center shadow-sm min-h-[350px] rounded-3xl animate-fade-in">
          <div className="h-14 w-14 rounded-2xl bg-[#A78BFA]/10 flex items-center justify-center text-[#A78BFA] mb-5 border border-[#A78BFA]/20">
            <Sparkles className="h-7 w-7 animate-pulse" />
          </div>
          <h4 className="font-syne font-bold text-lg text-[#334155]">
            No brand opportunities yet
          </h4>
          <p className="text-sm text-slate-500 max-w-md mt-2 leading-relaxed font-sans">
            Your future collaborations will appear here. Track campaign details, organize brand offers, and grow your partnerships seamlessly.
          </p>
          <Button 
            onClick={() => setIsAddOpen(true)}
            className="mt-6 text-xs font-bold px-5 py-3 cursor-pointer bg-gradient-to-r from-[#A78BFA] to-[#F9A8D4] border-0 text-white font-syne"
          >
            Register Your First Opportunity
          </Button>
        </Card>
      ) : (
        /* CRM Board Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((col) => {
            const colContacts = contacts.filter((c) => c.status === col.key);
            return (
              <div 
                key={col.key}
                className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col min-h-[450px] shadow-sm"
              >
                {/* Column Header */}
                <div className={`flex items-center justify-between border-b pb-3 mb-4 ${col.color.split(" ")[1]}`}>
                  <h3 className="font-syne font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                    {col.title}
                  </h3>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
                    {colContacts.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 space-y-4 overflow-y-auto">
                  {colContacts.length === 0 ? (
                    <div className="h-32 border border-dashed border-slate-100 rounded-xl flex flex-col items-center justify-center text-center p-4">
                      <span className="text-[10px] font-semibold text-slate-400 block uppercase font-syne">No active collaborations</span>
                    </div>
                  ) : (
                    colContacts.map((contact) => {
                      const nextStage = getNextStage(contact.status);
                      return (
                        <Card 
                          key={contact.id}
                          className="bg-white border border-slate-200 hover:border-slate-300 transition-all duration-200 shadow-sm p-4 relative group"
                        >
                          <CardContent className="p-0 space-y-3">
                            {/* Contact Name & Delete */}
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-syne font-bold text-sm text-[#0F172A] truncate pr-4">
                                {contact.name}
                              </h4>
                              <button
                                onClick={() => handleDeleteContact(contact.id)}
                                className="text-slate-400 hover:text-red-500 p-0.5 transition-colors absolute top-3.5 right-3.5 cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            {/* Handle and Email */}
                            <div className="space-y-1.5 text-xs text-slate-500 font-sans">
                              {contact.handle && (
                                <div className="flex items-center gap-1.5 truncate">
                                  {contact.handle.includes("@") ? (
                                    <Instagram className="h-3.5 w-3.5 text-pink-500 flex-shrink-0" />
                                  ) : (
                                    <Phone className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                                  )}
                                  <span className="truncate">{contact.handle}</span>
                                </div>
                              )}
                              {contact.email && (
                                <div className="flex items-center gap-1.5 truncate">
                                  <Mail className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
                                  <span className="truncate">{contact.email}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1.5 text-[10px]">
                                <Calendar className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                                <span>Updated {new Date(contact.lastInteraction).toLocaleDateString()}</span>
                              </div>
                            </div>

                            {/* Contact Notes */}
                            {contact.notes && (
                              <p className="text-xs text-slate-500 italic bg-slate-50 border border-slate-100 rounded-lg p-2 leading-relaxed">
                                {contact.notes}
                              </p>
                            )}

                            {/* Promoting Actions */}
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                              <button
                                onClick={() => handleTriggerFollowup(contact.id)}
                                className="text-[10px] font-bold text-violet-600 hover:text-violet-500 flex items-center gap-1 cursor-pointer font-syne"
                              >
                                <Sparkles className="h-3 w-3 text-violet-500" />
                                AI Follow-Up
                              </button>
                              {nextStage && (
                                <button
                                  onClick={() => handleUpdateStatus(contact.id, nextStage)}
                                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-500 flex items-center gap-1 cursor-pointer font-syne"
                                >
                                  Advance Stage
                                  <ArrowRight className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Lead Dialog Modal */}
      <Dialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Register Brand Opportunity 📥"
        description="Add a new brand collaborator or active contact to your opportunities."
      >
        <form onSubmit={handleAddContact} className="space-y-4 text-slate-800 py-2">
          {/* Brand/Contact Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Brand or Manager Name *
            </label>
            <Input
              type="text"
              placeholder="e.g. Nike Sponsorship Dept / Sarah Jones"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={formLoading}
              required
              className="text-sm focus:border-indigo-500"
            />
          </div>

          {/* Social Handle */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Instagram Handle / WhatsApp Number
            </label>
            <Input
              type="text"
              placeholder="e.g. @nike_marketing or +1 234 567 890"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              disabled={formLoading}
              className="text-sm focus:border-indigo-500"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Contact Email
            </label>
            <Input
              type="email"
              placeholder="sarah@nike.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={formLoading}
              className="text-sm focus:border-indigo-500"
            />
          </div>

          {/* Stage selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Opportunity Stage
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={formLoading}
              className="w-full text-sm rounded-lg p-2.5 bg-white border border-slate-300 focus:border-indigo-500 focus:ring focus:ring-indigo-100 font-sans"
            >
              <option value="NEW">📥 New Opportunity</option>
              <option value="INTERESTED">⭐️ Interested</option>
              <option value="NEGOTIATING">💬 Negotiating</option>
              <option value="CLOSED">🎉 Deal Closed</option>
            </select>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Deal Notes & Reminders
            </label>
            <textarea
              placeholder="e.g. Discussed dedicated reel. Rates quoted $500."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={formLoading}
              rows={3}
              className="w-full text-sm rounded-lg p-2.5 bg-white border border-slate-300 focus:border-indigo-500 focus:ring focus:ring-indigo-100 font-sans"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Button
              type="submit"
              isLoading={formLoading}
              className="w-full sm:flex-1 py-3 text-xs sm:text-sm font-bold font-syne bg-gradient-to-r from-[#A78BFA] to-[#F9A8D4] border-0 text-white"
            >
              Save Opportunity
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsAddOpen(false)}
              className="w-full sm:w-auto text-xs"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Dialog>

      {/* AI Follow-up Dialog Modal */}
      <Dialog
        isOpen={isFollowupOpen}
        onClose={() => setIsFollowupOpen(false)}
        title="AI Collaboration Follow-Up Pitch ✨"
        description="Gemini has synthesized your notes to draft a friendly follow-up."
      >
        <div className="space-y-4 text-slate-800 py-2">
          {followupLoading && (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="h-9 w-9 rounded-full border-4 border-slate-200 border-t-indigo-500 animate-spin mb-4" />
              <span className="text-xs text-slate-500 font-semibold">Analyzing deal history and drafting pitch...</span>
            </div>
          )}

          {!followupLoading && followupResult && (
            <div className="space-y-4">
              {/* Delay suggestion badge */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3.5 text-xs text-indigo-700 space-y-1">
                <span className="font-bold uppercase tracking-wider text-[10px] block">
                  📆 Suggested Timing Delay
                </span>
                <p className="font-semibold text-slate-800">
                  Send in {followupResult.suggestedDelayDays} days
                </p>
                <p className="text-slate-500 leading-relaxed mt-0.5 font-sans">
                  {followupResult.rationale}
                </p>
              </div>

              {/* Message text block */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Draft pitch body
                </label>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs leading-relaxed text-slate-700 whitespace-pre-wrap select-text max-h-[220px] overflow-y-auto font-mono">
                  {followupResult.followupMessage}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(followupResult.followupMessage);
                    toast.success("Follow-up pitch copied to clipboard!");
                  }}
                  className="w-full sm:flex-1 py-3 text-xs sm:text-sm font-bold font-syne cursor-pointer"
                >
                  Copy Pitch Body
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsFollowupOpen(false)}
                  className="w-full sm:w-auto text-xs cursor-pointer"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
}
