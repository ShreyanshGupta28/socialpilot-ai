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

  // Fetch all CRM contacts on mount
  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/crm/contact");
      const data = await res.json();
      if (res.ok && data.contacts) {
        setContacts(data.contacts);
      } else {
        toast.error("Failed to load CRM pipeline.");
      }
    } catch (e) {
      toast.error("Network error loading CRM pipeline.");
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
      if (!response.ok) throw new Error(data.error || "Failed to add lead.");

      toast.success("Sponsorship lead added successfully!");
      setIsAddOpen(false);
      
      // Clear fields
      setName("");
      setHandle("");
      setEmail("");
      setStatus("NEW");
      setNotes("");
      
      fetchContacts();
    } catch (err: any) {
      toast.error(err.message || "Failed to create lead.");
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
      
      toast.success(`Lead moved to ${newStatus}!`);
      fetchContacts();
    } catch (e) {
      toast.error("Failed to update lead status.");
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead from your pipeline?")) return;

    try {
      const response = await fetch(`/api/crm/contact?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete lead");

      toast.success("Lead removed from pipeline.");
      fetchContacts();
    } catch (e) {
      toast.error("Failed to delete lead.");
    }
  };

  // Group contacts by status
  const columns = [
    { key: "NEW", title: "📥 New Leads", color: "bg-blue-500/10 text-blue-600 border-blue-200" },
    { key: "INTERESTED", title: "⭐️ Interested", color: "bg-violet-500/10 text-violet-600 border-violet-200" },
    { key: "NEGOTIATING", title: "💬 Negotiating", color: "bg-amber-500/10 text-amber-600 border-amber-200" },
    { key: "CLOSED", title: "🎉 Deals Closed", color: "bg-emerald-500/10 text-emerald-600 border-emerald-200" }
  ];

  const getNextStage = (current: string) => {
    if (current === "NEW") return "INTERESTED";
    if (current === "INTERESTED") return "NEGOTIATING";
    if (current === "NEGOTIATING") return "CLOSED";
    return null;
  };

  return (
    <div className="space-y-8 text-[#0F172A] font-sans">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-syne text-[#0F172A] tracking-wide flex items-center gap-2">
            Influencer CRM
            <Users className="h-7 w-7 text-indigo-500" />
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Track sponsorship negotiations, manage active brand deals, and organize campaign conversations in one place.
          </p>
        </div>
        <div>
          <Button 
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 py-3 px-5 text-sm font-bold font-syne shadow-md shadow-indigo-600/10 cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5" />
            Add New Lead
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
                    <div className="h-32 border-2 border-dashed border-slate-100 rounded-xl flex flex-col items-center justify-center text-center p-4">
                      <span className="text-[10px] font-semibold text-slate-400 block uppercase">Empty Column</span>
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
                            {nextStage && (
                              <div className="pt-2 border-t border-slate-100 flex justify-end">
                                <button
                                  onClick={() => handleUpdateStatus(contact.id, nextStage)}
                                  className="text-xs font-bold text-indigo-600 hover:text-indigo-500 flex items-center gap-1 cursor-pointer font-syne"
                                >
                                  Advance Stage
                                  <ArrowRight className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            )}
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
        title="Register Sponsorship Lead 📥"
        description="Add a new brand collaborator or active contact to your pipeline."
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
              Pipeline Stage
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={formLoading}
              className="w-full text-sm rounded-lg p-2.5 bg-white border border-slate-300 focus:border-indigo-500 focus:ring focus:ring-indigo-100 font-sans"
            >
              <option value="NEW">📥 New Lead</option>
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
              className="w-full sm:flex-1 py-3 text-xs sm:text-sm font-bold font-syne"
            >
              Register Sponsorship
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
    </div>
  );
}
