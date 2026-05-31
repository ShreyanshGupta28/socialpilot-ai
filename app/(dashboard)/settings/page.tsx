"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { toast } from "sonner";
import { Settings, User, KeyRound, ShieldAlert } from "lucide-react";

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();

  // Profile Form States
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [profileLoading, setProfileLoading] = React.useState(false);

  // Password Form States
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [passwordLoading, setPasswordLoading] = React.useState(false);

  // Deletion Modal States
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = React.useState("");

  // Sync state with NextAuth session on mount
  React.useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
    }
  }, [session]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email) {
      toast.error("Please fill in both name and email fields.");
      return;
    }

    setProfileLoading(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update profile");

      // Update local NextAuth session cache
      await updateSession({
        name: data.user.name,
        email: data.user.email,
      });

      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "An error occurred while updating profile.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("The new passwords entered do not match.");
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update password");

      toast.success("Password changed successfully!");
      
      // Clear password inputs
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to change password. Old password may be incorrect.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation.toLowerCase() !== "delete my account") {
      toast.error("Please type the exact phrase to confirm deletion.");
      return;
    }

    setDeleteLoading(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete account");

      toast.success("Account deleted successfully. We're sorry to see you go.");
      
      // Sign out and redirect immediately
      await signOut({ callbackUrl: "/login" });
    } catch (err: any) {
      toast.error(err.message || "Failed to delete account. Please try again.");
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-8 text-[#F0F4FF]">
      {/* Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-syne text-white tracking-wide flex items-center gap-2">
          Account Settings
          <Settings className="h-7 w-7 text-violet-400" />
        </h2>
        <p className="text-sm text-muted mt-1">
          Customize your profile, change secure password keys, or deactivate your pilot credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Profile Card Form */}
        <Card className="bg-white/5 border-white/10 shadow-md">
          <CardHeader className="border-b border-white/5 flex flex-row items-center gap-3 py-4">
            <div className="p-2 bg-violet-600/10 text-violet-400 rounded-lg">
              <User className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Profile Details</CardTitle>
              <CardDescription className="text-xs">Update your display name and login email.</CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted tracking-wider uppercase">
                  Display Name
                </label>
                <Input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={profileLoading}
                  className="focus:border-violet-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted tracking-wider uppercase">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={profileLoading}
                  className="focus:border-violet-500/50"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" isLoading={profileLoading} className="py-2.5 text-xs font-bold font-syne px-5">
                  Save Settings
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Change Password Card Form */}
        <Card className="bg-white/5 border-white/10 shadow-md">
          <CardHeader className="border-b border-white/5 flex flex-row items-center gap-3 py-4">
            <div className="p-2 bg-indigo-600/10 text-[#5C6BC0] rounded-lg">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Password Keys</CardTitle>
              <CardDescription className="text-xs">Upgrade your account password security.</CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted tracking-wider uppercase">
                  Current Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={passwordLoading}
                  className="focus:border-violet-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted tracking-wider uppercase">
                  New Password
                </label>
                <Input
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={passwordLoading}
                  className="focus:border-violet-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted tracking-wider uppercase">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={passwordLoading}
                  className="focus:border-violet-500/50"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" isLoading={passwordLoading} className="py-2.5 text-xs font-bold font-syne px-5">
                  Update Password
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="bg-red-500/5 border border-red-500/10 shadow-sm mt-4">
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h4 className="font-syne font-bold text-sm uppercase tracking-wider text-red-400 flex items-center gap-1.5">
              <ShieldAlert className="h-4.5 w-4.5" /> Danger Zone
            </h4>
            <p className="text-xs sm:text-sm text-muted max-w-xl leading-relaxed">
              Permanently close and delete your SocialPilot account. This action removes your profile, generated histories, and billing subscription links immediately. It cannot be undone.
            </p>
          </div>
          <div>
            <Button
              variant="danger"
              onClick={() => setIsDeleteOpen(true)}
              className="py-2.5 text-xs font-bold font-syne px-5 shadow-md shadow-red-600/10"
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Account Dialog Confirmation Modal */}
      <Dialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Account Permanently ⚠️"
        description="Are you absolutely sure you want to delete your credentials profile?"
      >
        <div className="space-y-5 py-2 text-[#F0F4FF]">
          <div className="bg-red-600/10 border border-red-500/20 text-red-400 text-xs sm:text-sm rounded-xl p-3 leading-relaxed">
            All template logs, customer sentiment charts, and payment methods will be cleared instantly from our servers.
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted">
              To proceed, please type <span className="text-[#F0F4FF] font-bold">&quot;delete my account&quot;</span> in the field below:
            </p>
            <Input
              type="text"
              placeholder="delete my account"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              className="focus:border-red-500/50 focus:ring-red-500/20 text-xs sm:text-sm h-10"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              isLoading={deleteLoading}
              className="w-full sm:flex-1 py-3 text-xs sm:text-sm font-bold font-syne"
            >
              Confirm Account Deletion
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setIsDeleteOpen(false);
                setDeleteConfirmation("");
              }}
              className="w-full sm:w-auto text-xs"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
