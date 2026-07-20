import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, ArrowLeft, Search, CheckCircle, AlertCircle, Shield, UserCog, Ban, Mail, Edit
} from "lucide-react";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle 
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import auth from "@/lib/shared/kliv-auth.js";

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [userForm, setUserForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    groups: [] as string[],
    enabled: true
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // Get all users using auth.listUsers
      const response = await auth.listUsers();
      
      if (response && response.users) {
        setUsers(response.users);
      }
    } catch (err) {
      console.error("Error loading users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (user: any) => {
    try {
      setError("");
      await user.setEnabled(user.enabled === 0 ? 1 : 0, user.user_uuid);
      setSuccess(`User ${user.enabled ? "disabled" : "enabled"} successfully!`);
      loadUsers();
    } catch (err) {
      console.error("Error toggling user status:", err);
      setError("Failed to update user status");
    }
  };

  const handleUpdateUserGroups = async () => {
    try {
      setError("");
      await auth.setGroups(selectedUser.user_uuid, userForm.groups);
      setSuccess("User groups updated successfully!");
      setShowUserModal(false);
      loadUsers();
    } catch (err) {
      console.error("Error updating user groups:", err);
      setError("Failed to update user groups");
    }
  };

  const openUserModal = (user: any) => {
    setSelectedUser(user);
    setUserForm({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      groups: user.groups || [],
      enabled: user.enabled !== 0
    });
    setShowUserModal(true);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";
  };

  const getRoleBadge = (groups: string[]) => {
    if (groups?.includes("Admins")) return { label: "Admin", color: "bg-purple-100 text-purple-700" };
    if (groups?.includes("Shop Owners")) return { label: "Seller", color: "bg-orange-100 text-orange-700" };
    return { label: "Customer", color: "bg-blue-100 text-blue-700" };
  };

  const filteredUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter(user => {
        const groups = user.groups || [];
        if (roleFilter === "admin") return groups.includes("Admins");
        if (roleFilter === "seller") return groups.includes("Shop Owners");
        if (roleFilter === "customer") return !groups.includes("Admins") && !groups.includes("Shop Owners");
        return true;
      });
    }

    if (statusFilter === "active") {
      filtered = filtered.filter(user => user.enabled !== 0);
    } else if (statusFilter === "disabled") {
      filtered = filtered.filter(user => user.enabled === 0);
    }

    return filtered;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard/admin" className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">User Management</span>
                <p className="text-sm text-slate-600">Manage platform users and permissions</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 mb-1">Total Users</p>
                  <p className="text-3xl font-bold">{users.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 mb-1">Active</p>
                  <p className="text-3xl font-bold">{users.filter(u => u.enabled !== 0).length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 mb-1">Admins</p>
                  <p className="text-3xl font-bold">{users.filter(u => u.groups?.includes("Admins")).length}</p>
                </div>
                <Shield className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 mb-1">Sellers</p>
                  <p className="text-3xl font-bold">{users.filter(u => u.groups?.includes("Shop Owners")).length}</p>
                </div>
                <UserCog className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <Card className="mb-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                  <SelectItem value="seller">Sellers</SelectItem>
                  <SelectItem value="customer">Customers</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left p-4 font-semibold text-slate-900">User</th>
                    <th className="text-left p-4 font-semibold text-slate-900">Email</th>
                    <th className="text-left p-4 font-semibold text-slate-900">Role</th>
                    <th className="text-left p-4 font-semibold text-slate-900">Status</th>
                    <th className="text-left p-4 font-semibold text-slate-900">Joined</th>
                    <th className="text-left p-4 font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers().map((user) => {
                    const roleBadge = getRoleBadge(user.groups);
                    return (
                      <tr key={user.user_uuid} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600">
                              <AvatarFallback className="text-white text-sm">
                                {getInitials(user.first_name, user.last_name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.first_name} {user.last_name}</p>
                              <p className="text-sm text-slate-600">{user.user_uuid?.substring(0, 8)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-slate-400" />
                            <span>{user.email}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={roleBadge.color}>{roleBadge.label}</Badge>
                        </td>
                        <td className="p-4">
                          <Badge className={user.enabled ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                            {user.enabled ? "Active" : "Disabled"}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-slate-600">
                          {user.created_at ? new Date(user.created_at * 1000).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openUserModal(user)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant={user.enabled ? "destructive" : "outline"}
                              onClick={() => handleToggleUserStatus(user)}
                            >
                              {user.enabled ? (
                                <>
                                  <Ban className="w-4 h-4 mr-1" />
                                  Disable
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Enable
                                </>
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Edit Modal */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information and permissions</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedUser && (
              <>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600">
                      <AvatarFallback className="text-white">
                        {getInitials(selectedUser.first_name, selectedUser.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{selectedUser.first_name} {selectedUser.last_name}</p>
                      <p className="text-sm text-slate-600">{selectedUser.email}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>User Groups</Label>
                  <div className="space-y-2 mt-2">
                    {["Admins", "Shop Owners", "Customers"].map((group) => (
                      <div key={group} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={group}
                          checked={userForm.groups.includes(group)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setUserForm({
                                ...userForm,
                                groups: [...userForm.groups, group]
                              });
                            } else {
                              setUserForm({
                                ...userForm,
                                groups: userForm.groups.filter(g => g !== group)
                              });
                            }
                          }}
                          className="rounded"
                        />
                        <Label htmlFor={group}>{group}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="user_enabled"
                    checked={userForm.enabled}
                    onChange={(e) => setUserForm({...userForm, enabled: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="user_enabled">User Enabled</Label>
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <Button variant="outline" onClick={() => setShowUserModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateUserGroups} className="bg-gradient-to-r from-blue-500 to-blue-600">
                    Save Changes
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;