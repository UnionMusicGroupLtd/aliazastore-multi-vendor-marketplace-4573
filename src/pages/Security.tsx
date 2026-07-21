import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, ArrowLeft, CheckCircle, AlertTriangle, Lock,
  UserCheck, Activity, Settings, RefreshCw
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

const Security = () => {
  const [loading, setLoading] = useState(false);
  const [securityLogs, setSecurityLogs] = useState<any[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  // Sample security logs
  useEffect(() => {
    const sampleLogs = [
      { id: 1, type: "login_success", user: "admin@aliazastore.com", ip: "192.168.1.100", timestamp: Date.now() - 3600000, severity: "info" },
      { id: 2, type: "login_attempt", user: "unknown", ip: "192.168.1.105", timestamp: Date.now() - 7200000, severity: "warning" },
      { id: 3, type: "password_change", user: "admin@aliazastore.com", ip: "192.168.1.100", timestamp: Date.now() - 86400000, severity: "info" },
      { id: 4, type: "failed_login", user: "hacker@malicious.com", ip: "192.168.1.200", timestamp: Date.now() - 90000000, severity: "danger" },
      { id: 5, type: "api_access", user: "system", ip: "localhost", timestamp: Date.now() - 95000000, severity: "info" }
    ];
    setSecurityLogs(sampleLogs);
  }, []);

  const [securitySettings, setSecuritySettings] = useState({
    enableTwoFactor: false,
    sessionTimeout: 30,
    passwordMinLength: 8,
    requireStrongPassword: true,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    enableIpBlocking: true,
    enableAuditLog: true,
    notifyOnSuspiciousActivity: true
  });

  const [blockedIps, setBlockedIps] = useState([
    { id: 1, ip: "192.168.1.200", reason: "Multiple failed login attempts", attempts: 15, blockedAt: Date.now() - 86400000 }
  ]);

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      console.log("Saving security settings...", securitySettings);
      
      // Simulate saving with better feedback
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Security settings saved successfully");
      alert("Security settings saved successfully!");
      
      setLoading(false);
    } catch (err) {
      console.error("Error saving security settings:", err);
      alert("Failed to save security settings. Please try again.");
      setLoading(false);
    }
  };

  const handleUnblockIp = async (ipId: number) => {
    setBlockedIps(blockedIps.filter(ip => ip.id !== ipId));
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case "login_success": return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "failed_login": return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "password_change": return <Lock className="w-5 h-5 text-blue-600" />;
      case "api_access": return <Settings className="w-5 h-5 text-purple-600" />;
      default: return <Activity className="w-5 h-5 text-slate-600" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "info": return "bg-blue-100 text-blue-700";
      case "warning": return "bg-orange-100 text-orange-700";
      case "danger": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

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
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">Security Center</span>
                <p className="text-sm text-slate-600">Platform security and access management</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Security Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 mb-1">Security Status</p>
                  <p className="text-3xl font-bold">Secure</p>
                  <p className="text-sm text-green-100 mt-2">All systems protected</p>
                </div>
                <Shield className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 mb-1">Active Sessions</p>
                  <p className="text-3xl font-bold">23</p>
                  <p className="text-sm text-blue-100 mt-2">Currently active</p>
                </div>
                <UserCheck className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 mb-1">Blocked IPs</p>
                  <p className="text-3xl font-bold">{blockedIps.length}</p>
                  <p className="text-sm text-orange-100 mt-2">Blocked addresses</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 mb-1">Security Events</p>
                  <p className="text-3xl font-bold">{securityLogs.length}</p>
                  <p className="text-sm text-purple-100 mt-2">Last 24 hours</p>
                </div>
                <Activity className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Settings */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle>Security Configuration</CardTitle>
            <CardDescription>Manage platform security settings and policies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-slate-600">Require 2FA for admin accounts</p>
                </div>
                <Switch 
                  checked={securitySettings.enableTwoFactor}
                  onChange={(e) => setSecuritySettings({...securitySettings, enableTwoFactor: e.target.checked})}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <p className="font-medium">Strong Passwords</p>
                  <p className="text-sm text-slate-600">Require complex passwords for all users</p>
                </div>
                <Switch 
                  checked={securitySettings.requireStrongPassword}
                  onChange={(e) => setSecuritySettings({...securitySettings, requireStrongPassword: e.target.checked})}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <p className="font-medium">IP Blocking</p>
                  <p className="text-sm text-slate-600">Automatically block suspicious IPs</p>
                </div>
                <Switch 
                  checked={securitySettings.enableIpBlocking}
                  onChange={(e) => setSecuritySettings({...securitySettings, enableIpBlocking: e.target.checked})}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <p className="font-medium">Audit Logging</p>
                  <p className="text-sm text-slate-600">Log all security-related events</p>
                </div>
                <Switch 
                  checked={securitySettings.enableAuditLog}
                  onChange={(e) => setSecuritySettings({...securitySettings, enableAuditLog: e.target.checked})}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <p className="font-medium">Suspicious Activity Alerts</p>
                  <p className="text-sm text-slate-600">Notify admins of security threats</p>
                </div>
                <Switch 
                  checked={securitySettings.notifyOnSuspiciousActivity}
                  onChange={(e) => setSecuritySettings({...securitySettings, notifyOnSuspiciousActivity: e.target.checked})}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label>Session Timeout (minutes)</Label>
                <Input
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                  placeholder="30"
                />
              </div>
              <div>
                <Label>Minimum Password Length</Label>
                <Input
                  type="number"
                  value={securitySettings.passwordMinLength}
                  onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
                  placeholder="8"
                />
              </div>
              <div>
                <Label>Max Login Attempts</Label>
                <Input
                  type="number"
                  value={securitySettings.maxLoginAttempts}
                  onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
                  placeholder="5"
                />
              </div>
              <div>
                <Label>Lockout Duration (minutes)</Label>
                <Input
                  type="number"
                  value={securitySettings.lockoutDuration}
                  onChange={(e) => setSecuritySettings({...securitySettings, lockoutDuration: parseInt(e.target.value)})}
                  placeholder="15"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={handleSaveSettings}
                disabled={loading}
                className="bg-gradient-to-r from-blue-500 to-blue-600"
              >
                {loading ? "Saving..." : "Save Security Settings"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Blocked IPs */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle>Blocked IP Addresses</CardTitle>
            <CardDescription>Manage blocked IP addresses and unblock requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left p-4 font-semibold text-slate-900">IP Address</th>
                    <th className="text-left p-4 font-semibold text-slate-900">Reason</th>
                    <th className="text-left p-4 font-semibold text-slate-900">Attempts</th>
                    <th className="text-left p-4 font-semibold text-slate-900">Blocked At</th>
                    <th className="text-left p-4 font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blockedIps.map((blockedIp) => (
                    <tr key={blockedIp.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-4 font-mono">{blockedIp.ip}</td>
                      <td className="p-4 text-sm">{blockedIp.reason}</td>
                      <td className="p-4">
                        <Badge className="bg-red-100 text-red-700">{blockedIp.attempts} attempts</Badge>
                      </td>
                      <td className="p-4 text-sm text-slate-600">
                        {new Date(blockedIp.blockedAt).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUnblockIp(blockedIp.id)}
                        >
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Unblock
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Security Logs */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Security Activity Logs</CardTitle>
            <CardDescription>Recent security events and authentication attempts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {securityLogs.map((log) => (
                <div key={log.id} className="flex items-start space-x-4 p-4 border border-slate-200 rounded-lg bg-white">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    {getLogIcon(log.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{log.type.replace(/_/g, ' ').toUpperCase()}</span>
                      <Badge className={getSeverityBadge(log.severity)}>{log.severity}</Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-slate-600">
                      <span>User: {log.user}</span>
                      <span>IP: {log.ip}</span>
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Security;