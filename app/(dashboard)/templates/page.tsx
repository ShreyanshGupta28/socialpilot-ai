"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Dialog } from "@/components/ui/Dialog";
import { Badge } from "@/components/ui/Badge";
import { toast } from "sonner";
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit3, 
  Search,
  Copy,
  Check,
  Sparkles
} from "lucide-react";

interface Template {
  id: string;
  name: string;
  category: string;
  content: string;
  uses: number;
  createdAt: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = React.useState<Template[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("ALL");

  // Create Template States
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState("Sponsorship");
  const [content, setContent] = React.useState("");
  const [formLoading, setFormLoading] = React.useState(false);

  // Edit Template States
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [editId, setEditId] = React.useState("");
  const [editName, setEditName] = React.useState("");
  const [editCategory, setEditCategory] = React.useState("Sponsorship");
  const [editContent, setEditContent] = React.useState("");

  const categories = [
    "Sponsorship",
    "Brand Collaboration",
    "Pricing Inquiry",
    "Fan Reply",
    "Customer Support",
    "Custom"
  ];

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/templates");
      const data = await res.json();
      if (res.ok && data.templates) {
        setTemplates(data.templates);
      } else {
        toast.error("Failed to load templates.");
      }
    } catch (e) {
      toast.error("Network error loading templates.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTemplates();
  }, []);

  const handleAddTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Template name is required.");
      return;
    }
    if (!content.trim()) {
      toast.error("Template content is required.");
      return;
    }

    setFormLoading(true);
    try {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, content }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to add template.");

      toast.success("Custom template saved!");
      setIsAddOpen(false);
      
      // Clear fields
      setName("");
      setCategory("Sponsorship");
      setContent("");
      
      fetchTemplates();
    } catch (err: any) {
      toast.error(err.message || "Failed to create template.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error("Template name is required.");
      return;
    }
    if (!editContent.trim()) {
      toast.error("Template content is required.");
      return;
    }

    setFormLoading(true);
    try {
      const response = await fetch(`/api/templates/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, category: editCategory, content: editContent }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update template.");

      toast.success("Template changes saved!");
      setIsEditOpen(false);
      fetchTemplates();
    } catch (err: any) {
      toast.error(err.message || "Failed to edit template.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this custom template?")) return;

    try {
      const response = await fetch(`/api/templates/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete template");

      toast.success("Template deleted successfully.");
      fetchTemplates();
    } catch (e) {
      toast.error("Failed to delete template.");
    }
  };

  const openEditModal = (tpl: Template) => {
    setEditId(tpl.id);
    setEditName(tpl.name);
    setEditCategory(tpl.category);
    setEditContent(tpl.content);
    setIsEditOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Template content copied to clipboard!");
  };

  // Filter templates
  const filteredTemplates = templates.filter((tpl) => {
    const matchesCategory = categoryFilter === "ALL" || tpl.category === categoryFilter;
    const matchesSearch = tpl.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tpl.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "Sponsorship": return "bg-indigo-50 text-indigo-600 border-indigo-150";
      case "Brand Collaboration": return "bg-emerald-50 text-emerald-600 border-emerald-150";
      case "Pricing Inquiry": return "bg-amber-50 text-amber-600 border-amber-150";
      case "Fan Reply": return "bg-pink-50 text-pink-600 border-pink-150";
      case "Customer Support": return "bg-sky-50 text-sky-600 border-sky-150";
      default: return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="space-y-8 text-[#334155] font-sans">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-syne text-[#334155] tracking-wide flex items-center gap-2">
            Template Playbook
            <BookOpen className="h-7 w-7 text-indigo-500" />
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Build and organize your sponsorship responses, collaboration pitches, and support messages.
          </p>
        </div>
        <div>
          <Button 
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 py-3 px-5 text-sm font-bold font-syne shadow-md shadow-indigo-600/10 cursor-pointer bg-gradient-to-r from-[#A78BFA] to-[#F9A8D4] border-0 text-white"
          >
            <Plus className="h-4.5 w-4.5" />
            Create Template
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        {/* Search */}
        <div className="sm:col-span-8 relative">
          <Input
            placeholder="Search templates by name or content keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 focus:border-indigo-500 focus:ring-indigo-100 text-slate-700 bg-white"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
        </div>

        {/* Category selector */}
        <div className="sm:col-span-4">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full text-sm rounded-lg p-2.5 bg-white border border-slate-300 focus:border-indigo-500 focus:ring focus:ring-indigo-100 text-slate-700 font-sans cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <div className="h-10 w-10 rounded-full border-4 border-slate-200 border-t-indigo-500 animate-spin mb-4" />
          <span className="text-sm text-slate-500 font-medium">Loading templates...</span>
        </div>
      ) : templates.length === 0 ? (
        /* Stunning Premium Empty State when there are 0 templates in the platform */
        <Card className="bg-white border-slate-200 border-dashed border-2 p-12 flex flex-col items-center justify-center text-center shadow-sm min-h-[350px] rounded-3xl animate-fade-in">
          <div className="h-14 w-14 rounded-2xl bg-[#A78BFA]/10 flex items-center justify-center text-[#A78BFA] mb-5 border border-[#A78BFA]/20">
            <BookOpen className="h-7 w-7 animate-pulse" />
          </div>
          <h4 className="font-syne font-bold text-lg text-[#334155]">
            Create your first template and save time replying.
          </h4>
          <p className="text-sm text-slate-500 max-w-md mt-2 leading-relaxed font-sans">
            Draft your common collaboration pitches, media kit links, and campaign rates. Save them here to load in one click during reply generation.
          </p>
          <Button 
            onClick={() => setIsAddOpen(true)}
            className="mt-6 text-xs font-bold px-5 py-3 cursor-pointer bg-gradient-to-r from-[#A78BFA] to-[#F9A8D4] border-0 text-white font-syne"
          >
            Create Your First Template
          </Button>
        </Card>
      ) : filteredTemplates.length === 0 ? (
        <Card className="bg-white border-slate-200 border-dashed border-2 p-12 flex flex-col items-center justify-center text-center shadow-sm min-h-[300px] rounded-3xl">
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 mb-4 border border-indigo-100">
            <Sparkles className="h-6 w-6" />
          </div>
          <h4 className="font-syne font-bold text-base text-[#334155]">
            No Templates Found
          </h4>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mt-2 leading-relaxed">
            No templates match your filters. Try adjusting your search query or category selection.
          </p>
        </Card>
      ) : (
        /* Templates Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((tpl) => (
            <Card 
              key={tpl.id}
              className="bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 shadow-sm flex flex-col justify-between rounded-2xl p-5 relative group"
            >
              <CardContent className="p-0 space-y-4 flex flex-col justify-between h-full">
                <div className="space-y-2">
                  {/* Category and Actions Row */}
                  <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-wider ${getCategoryColor(tpl.category)}`}>
                      {tpl.category}
                    </Badge>
                    <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(tpl)}
                        className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
                        title="Edit Template"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(tpl.id)}
                        className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
                        title="Delete Template"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Title Name */}
                  <h3 className="font-syne font-bold text-base text-[#0F172A] truncate">
                    {tpl.name}
                  </h3>

                  {/* Body Content Box */}
                  <p className="text-xs text-slate-500 leading-relaxed font-sans line-clamp-4 whitespace-pre-wrap pt-1 min-h-[64px]">
                    {tpl.content}
                  </p>
                </div>

                {/* Footer copy row */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <span className="text-[10px] text-slate-400 font-medium">
                    Created {new Date(tpl.createdAt).toLocaleDateString()}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => copyToClipboard(tpl.content)}
                    className="h-8 py-1.5 px-3 text-[11px] font-bold font-syne bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-none"
                  >
                    <Copy className="h-3 w-3" />
                    Copy Content
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Template Modal */}
      <Dialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Create Custom Template ✍️"
        description="Save common replies or pitch paragraphs to reuse in one click."
      >
        <form onSubmit={handleAddTemplate} className="space-y-4 text-slate-800 py-2">
          {/* Template Title Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Template Title *
            </label>
            <Input
              type="text"
              placeholder="e.g. Media Kit Attach Link / Rates Card Quote"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={formLoading}
              required
              className="text-sm focus:border-indigo-500 focus:ring-indigo-100 text-slate-800 bg-white border-slate-300"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Template Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={formLoading}
              className="w-full text-sm rounded-lg p-2.5 bg-white border border-slate-300 focus:border-indigo-500 focus:ring focus:ring-indigo-100 text-slate-800 font-sans cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Template Content */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Template Content / Body *
            </label>
            <Textarea
              placeholder="e.g. Hi there! Thanks for reaching out. Here is a link to my media kit: [link]. My rate for a sponsored post is $500."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={formLoading}
              required
              rows={5}
              className="text-sm focus:border-indigo-500 focus:ring-indigo-100 text-slate-800 bg-white border-slate-300"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Button
              type="submit"
              isLoading={formLoading}
              className="w-full sm:flex-1 py-3 text-xs sm:text-sm font-bold font-syne cursor-pointer"
            >
              Save Template
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsAddOpen(false)}
              className="w-full sm:w-auto text-xs cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Edit Template Modal */}
      <Dialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Modify Custom Template ✍️"
        description="Update your template title, category, or content details."
      >
        <form onSubmit={handleEditTemplate} className="space-y-4 text-slate-800 py-2">
          {/* Template Title Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Template Title *
            </label>
            <Input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              disabled={formLoading}
              required
              className="text-sm focus:border-indigo-500 focus:ring-indigo-100 text-slate-800 bg-white border-slate-300"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Template Category *
            </label>
            <select
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              disabled={formLoading}
              className="w-full text-sm rounded-lg p-2.5 bg-white border border-slate-300 focus:border-indigo-500 focus:ring focus:ring-indigo-100 text-slate-800 font-sans cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Template Content */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Template Content / Body *
            </label>
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              disabled={formLoading}
              required
              rows={5}
              className="text-sm focus:border-indigo-500 focus:ring-indigo-100 text-slate-800 bg-white border-slate-300"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Button
              type="submit"
              isLoading={formLoading}
              className="w-full sm:flex-1 py-3 text-xs sm:text-sm font-bold font-syne cursor-pointer"
            >
              Save Changes
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsEditOpen(false)}
              className="w-full sm:w-auto text-xs cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
