import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Settings, ArrowLeft, CheckCircle, AlertCircle
} from "lucide-react";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { SimpleTabs, SimpleTabsList, SimpleTabsTrigger, SimpleTabsContent } from "@/components/ui/simple-tabs";
import db from '@/lib/shared/kliv-database.js';

console.log("AdminSettings component loaded - production build fix applied");

const AdminSettings = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [generalSettings, setGeneralSettings] = useState({
    siteName: "AliazaStore",
    siteDescription: "Multi-Vendor Marketplace",
    contactEmail: "info@unionmusicgroup.co.uk",
    contactPhone: "+63 912 345 6789",
    timezone: "Asia/Manila",
    language: "en-US"
  });

  // Load existing settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const { data } = await db.query('platform_settings', {});
        
        if (data && data.length > 0) {
          data.forEach((setting: any) => {
            try {
              const parsedSettings = JSON.parse(setting.settings);
              switch (setting.section) {
                case 'general':
                  setGeneralSettings(parsedSettings);
                  break;
                case 'payment':
                  setPaymentSettings(parsedSettings);
                  break;
                case 'email':
                  setEmailSettings(parsedSettings);
                  break;
                case 'security':
                  setSecuritySettings(parsedSettings);
                  break;
                case 'marketplace':
                  setMarketplaceSettings(parsedSettings);
                  break;
              }
            } catch (parseErr) {
              console.error(`Error parsing settings for ${setting.section}:`, parseErr);
            }
          });
        }
      } catch (err) {
        console.log('No existing settings found, using defaults');
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  const [paymentSettings, setPaymentSettings] = useState({
    enableGCash: true,
    enableStripe: false,
    enablePayPal: false,
    enableBankTransfer: false,
    minimumWithdrawal: 500,
    processingTime: "2-3 business days"
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "smtp.mailgun.org",
    smtpPort: "587",
    smtpUser: "postmaster@aliazastore.com",
    emailFrom: "noreply@aliazastore.com",
    enableEmailNotifications: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    enableTwoFactor: false,
    sessionTimeout: "30",
    passwordMinLength: "8",
    requireStrongPassword: true,
    maxLoginAttempts: "5"
  });

  const [marketplaceSettings, setMarketplaceSettings] = useState({
    enableRegistration: true,
    requireSellerApproval: true,
    commissionRate: "5",
    currency: "PHP",
    taxRate: "12"
  });

  const handleSaveSettings = async (section: string) => {
    try {
      setSaving(true);
      setError("");
      
      console.log(`Saving ${section} settings...`);
      
      // Get the settings object for the current section
      let settingsToSave;
      switch(section.toLowerCase()) {
        case 'general':
          settingsToSave = generalSettings;
          break;
        case 'payment':
          settingsToSave = paymentSettings;
          break;
        case 'email':
          settingsToSave = emailSettings;
          break;
        case 'security':
          settingsToSave = securitySettings;
          break;
        case 'marketplace':
          settingsToSave = marketplaceSettings;
          break;
        default:
          throw new Error(`Unknown section: ${section}`);
      }
      
      // Convert to JSON string for storage
      const settingsJson = JSON.stringify(settingsToSave);
      
      // Check if settings already exist
      const { data: existingSettings } = await db.query('platform_settings', { 
        section: `eq.${section.toLowerCase()}` 
      });
      
      if (existingSettings && existingSettings.length > 0) {
        // Update existing settings
        const { error } = await db.update('platform_settings', 
          { _row_id: `eq.${existingSettings[0]._row_id}` }, 
          { settings: settingsJson }
        );
        
        if (error) {
          console.error('Database error:', error);
          setError(`Failed to save ${section} settings. Please try again.`);
          return;
        }
      } else {
        // Insert new settings
        const { error } = await db.insert('platform_settings', {
          id: `admin-settings-${section.toLowerCase()}`,
          section: section.toLowerCase(),
          settings: settingsJson
        });
        
        if (error) {
          console.error('Database error:', error);
          setError(`Failed to save ${section} settings. Please try again.`);
          return;
        }
      }
      
      console.log(`${section} settings saved successfully`);
      
      setSuccess(`${section} settings saved successfully! Changes will take effect immediately.`);
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      console.error("Error saving settings:", err);
      setError("Failed to save settings. Please try again.");
      setTimeout(() => setError(""), 5000);
    } finally {
      setSaving(false);
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
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">Platform Settings</span>
                <p className="text-sm text-slate-600">Configure system settings and preferences</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
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

        <SimpleTabs defaultValue="general" className="space-y-6">
          <SimpleTabsList className="grid w-full grid-cols-5 lg:w-auto">
            <SimpleTabsTrigger value="general">General</SimpleTabsTrigger>
            <SimpleTabsTrigger value="payment">Payment</SimpleTabsTrigger>
            <SimpleTabsTrigger value="email">Email</SimpleTabsTrigger>
            <SimpleTabsTrigger value="security">Security</SimpleTabsTrigger>
            <SimpleTabsTrigger value="marketplace">Marketplace</SimpleTabsTrigger>
          </SimpleTabsList>

          {/* General Settings */}
          <SimpleTabsContent value="general">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Basic platform information and contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Site Name</Label>
                    <Input
                      value={generalSettings.siteName}
                      onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                      placeholder="AliazaStore"
                    />
                  </div>
                  <div>
                    <Label>Contact Email</Label>
                    <Input
                      type="email"
                      value={generalSettings.contactEmail}
                      onChange={(e) => setGeneralSettings({...generalSettings, contactEmail: e.target.value})}
                      placeholder="support@aliazastore.com"
                    />
                  </div>
                  <div>
                    <Label>Contact Phone</Label>
                    <Input
                      value={generalSettings.contactPhone}
                      onChange={(e) => setGeneralSettings({...generalSettings, contactPhone: e.target.value})}
                      placeholder="+63 912 345 6789"
                    />
                  </div>
                  <div>
                    <Label>Timezone</Label>
                    <Select value={generalSettings.timezone} onValueChange={(value) => setGeneralSettings({...generalSettings, timezone: value})}>
                      <SelectContent>
                        <SelectItem value="Asia/Manila">Asia/Manila (Philippines - UTC+8)</SelectItem>
                        <SelectItem value="Asia/Shanghai">Asia/Shanghai (China UTC+8)</SelectItem>
                        <SelectItem value="Asia/Singapore">Asia/Singapore (Singapore UTC+8)</SelectItem>
                        <SelectItem value="Asia/Hong_Kong">Asia/Hong_Kong (Hong Kong UTC+8)</SelectItem>
                        <SelectItem value="Asia/Taipei">Asia/Taipei (Taiwan UTC+8)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Asia/Tokyo (Japan UTC+9)</SelectItem>
                        <SelectItem value="Asia/Seoul">Asia/Seoul (South Korea UTC+9)</SelectItem>
                        <SelectItem value="Asia/Jakarta">Asia/Jakarta (Indonesia UTC+7)</SelectItem>
                        <SelectItem value="Asia/Bangkok">Asia/Bangkok (Thailand UTC+7)</SelectItem>
                        <SelectItem value="Asia/Kuala_Lumpur">Asia/Kuala_Lumpur (Malaysia UTC+8)</SelectItem>
                        <SelectItem value="Pacific/Port_Moresby">Pacific/Port_Moresby (Papua New Guinea UTC+10)</SelectItem>
                        <SelectItem value="Australia/Sydney">Australia/Sydney (Australia UTC+10/+11)</SelectItem>
                        <SelectItem value="Australia/Melbourne">Australia/Melbourne (Australia UTC+10/+11)</SelectItem>
                        <SelectItem value="Pacific/Auckland">Pacific/Auckland (New Zealand UTC+12/+13)</SelectItem>
                        <SelectItem value="America/New_York">America/New_York (Eastern US UTC-5/-4)</SelectItem>
                        <SelectItem value="America/Chicago">America/Chicago (Central US UTC-6/-5)</SelectItem>
                        <SelectItem value="America/Denver">America/Denver (Mountain US UTC-7/-6)</SelectItem>
                        <SelectItem value="America/Los_Angeles">America/Los_Angeles (Pacific US UTC-8/-7)</SelectItem>
                        <SelectItem value="America/Toronto">America/Toronto (Canada UTC-5/-4)</SelectItem>
                        <SelectItem value="America/Vancouver">America/Vancouver (Canada UTC-8/-7)</SelectItem>
                        <SelectItem value="Europe/London">Europe/London (UK UTC+0/+1)</SelectItem>
                        <SelectItem value="Europe/Paris">Europe/Paris (France UTC+1/+2)</SelectItem>
                        <SelectItem value="Europe/Berlin">Europe/Berlin (Germany UTC+1/+2)</SelectItem>
                        <SelectItem value="Europe/Amsterdam">Europe/Amsterdam (Netherlands UTC+1/+2)</SelectItem>
                        <SelectItem value="Europe/Rome">Europe/Rome (Italy UTC+1/+2)</SelectItem>
                        <SelectItem value="Europe/Madrid">Europe/Madrid (Spain UTC+1/+2)</SelectItem>
                        <SelectItem value="Europe/Zurich">Europe/Zurich (Switzerland UTC+1/+2)</SelectItem>
                        <SelectItem value="Europe/Brussels">Europe/Brussels (Belgium UTC+1/+2)</SelectItem>
                        <SelectItem value="Europe/Vienna">Europe/Vienna (Austria UTC+1/+2)</SelectItem>
                        <SelectItem value="Asia/Dubai">Asia/Dubai (UAE UTC+4)</SelectItem>
                        <SelectItem value="Asia/Riyadh">Asia/Riyadh (Saudi Arabia UTC+3)</SelectItem>
                        <SelectItem value="Asia/Kuwait">Asia/Kuwait (Kuwait UTC+3)</SelectItem>
                        <SelectItem value="Asia/Bahrain">Asia/Bahrain (Bahrain UTC+3)</SelectItem>
                        <SelectItem value="Asia/Qatar">Asia/Qatar (Qatar UTC+3)</SelectItem>
                        <SelectItem value="Asia/Muscat">Asia/Muscat (Oman UTC+4)</SelectItem>
                        <SelectItem value="Indian/Mauritius">Indian/Mauritius (Mauritius UTC+4)</SelectItem>
                        <SelectItem value="Asia/Kolkata">Asia/Kolkata (India UTC+5:30)</SelectItem>
                        <SelectItem value="Asia/Mumbai">Asia/Mumbai (India UTC+5:30)</SelectItem>
                        <SelectItem value="Asia/Colombo">Asia/Colombo (Sri Lanka UTC+5:30)</SelectItem>
                        <SelectItem value="Asia/Dhaka">Asia/Dhaka (Bangladesh UTC+6)</SelectItem>
                        <SelectItem value="Asia/Karachi">Asia/Karachi (Pakistan UTC+5)</SelectItem>
                        <SelectItem value="Asia/Lahore">Asia/Lahore (Pakistan UTC+5)</SelectItem>
                        <SelectItem value="Asia/Tehran">Asia/Tehran (Iran UTC+3:30)</SelectItem>
                        <SelectItem value="Asia/Baghdad">Asia/Baghdad (Iraq UTC+3)</SelectItem>
                        <SelectItem value="Asia/Jerusalem">Asia/Jerusalem (Israel UTC+2/+3)</SelectItem>
                        <SelectItem value="Africa/Cairo">Africa/Cairo (Egypt UTC+2)</SelectItem>
                        <SelectItem value="Africa/Johannesburg">Africa/Johannesburg (South Africa UTC+2)</SelectItem>
                        <SelectItem value="Africa/Lagos">Africa/Lagos (Nigeria UTC+1)</SelectItem>
                        <SelectItem value="Africa/Nairobi">Africa/Nairobi (Kenya UTC+3)</SelectItem>
                        <SelectItem value="America/Sao_Paulo">America/Sao_Paulo (Brazil UTC-3/-2)</SelectItem>
                        <SelectItem value="America/Mexico_City">America/Mexico_City (Mexico UTC-6/-5)</SelectItem>
                        <SelectItem value="America/Argentina/Buenos_Aires">America/Argentina/Buenos_Aires (Argentina UTC-3)</SelectItem>
                        <SelectItem value="Pacific/Honolulu">Pacific/Honolulu (Hawaii UTC-10)</SelectItem>
                        <SelectItem value="Pacific/Fiji">Pacific/Fiji (Fiji UTC+12/+13)</SelectItem>
                        <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Site Description</Label>
                  <Input
                    value={generalSettings.siteDescription}
                    onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})}
                    placeholder="Multi-Vendor Marketplace"
                  />
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={() => handleSaveSettings("General")}
                    disabled={saving}
                    className="bg-gradient-to-r from-blue-500 to-blue-600"
                  >
                    {saving ? "Saving..." : "Save General Settings"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </SimpleTabsContent>

          {/* Payment Settings */}
          <SimpleTabsContent value="payment">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>Configure payment methods and withdrawal policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Payment Methods</h3>
                  
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div>
                      <p className="font-medium">GCash</p>
                      <p className="text-sm text-slate-600">Primary payment method</p>
                    </div>
                    <Switch 
                      checked={paymentSettings.enableGCash}
                      onChange={(e) => setPaymentSettings({...paymentSettings, enableGCash: e.target.checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div>
                      <p className="font-medium">Stripe</p>
                      <p className="text-sm text-slate-600">International payments</p>
                    </div>
                    <Switch 
                      checked={paymentSettings.enableStripe}
                      onChange={(e) => setPaymentSettings({...paymentSettings, enableStripe: e.target.checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div>
                      <p className="font-medium">PayPal</p>
                      <p className="text-sm text-slate-600">Global payments</p>
                    </div>
                    <Switch 
                      checked={paymentSettings.enablePayPal}
                      onChange={(e) => setPaymentSettings({...paymentSettings, enablePayPal: e.target.checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div>
                      <p className="font-medium">Bank Transfer</p>
                      <p className="text-sm text-slate-600">Direct bank transfers</p>
                    </div>
                    <Switch 
                      checked={paymentSettings.enableBankTransfer}
                      onChange={(e) => setPaymentSettings({...paymentSettings, enableBankTransfer: e.target.checked})}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Minimum Withdrawal (₱)</Label>
                    <Input
                      type="number"
                      value={paymentSettings.minimumWithdrawal}
                      onChange={(e) => setPaymentSettings({...paymentSettings, minimumWithdrawal: parseInt(e.target.value)})}
                      placeholder="500"
                    />
                  </div>
                  <div>
                    <Label>Processing Time</Label>
                    <Input
                      value={paymentSettings.processingTime}
                      onChange={(e) => setPaymentSettings({...paymentSettings, processingTime: e.target.value})}
                      placeholder="2-3 business days"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={() => handleSaveSettings("Payment")}
                    disabled={saving}
                    className="bg-gradient-to-r from-green-500 to-green-600"
                  >
                    {saving ? "Saving..." : "Save Payment Settings"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </SimpleTabsContent>

          {/* Email Settings */}
          <SimpleTabsContent value="email">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Email Configuration</CardTitle>
                <CardDescription>SMTP settings and email notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>SMTP Host</Label>
                    <Input
                      value={emailSettings.smtpHost}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                      placeholder="smtp.mailgun.org"
                    />
                  </div>
                  <div>
                    <Label>SMTP Port</Label>
                    <Input
                      value={emailSettings.smtpPort}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                      placeholder="587"
                    />
                  </div>
                  <div>
                    <Label>SMTP Username</Label>
                    <Input
                      value={emailSettings.smtpUser}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpUser: e.target.value})}
                      placeholder="postmaster@aliazastore.com"
                    />
                  </div>
                  <div>
                    <Label>From Email</Label>
                    <Input
                      type="email"
                      value={emailSettings.emailFrom}
                      onChange={(e) => setEmailSettings({...emailSettings, emailFrom: e.target.value})}
                      placeholder="noreply@aliazastore.com"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-4 border border-slate-200 rounded-lg">
                  <Switch 
                    checked={emailSettings.enableEmailNotifications}
                    onChange={(e) => setEmailSettings({...emailSettings, enableEmailNotifications: e.target.checked})}
                  />
                  <Label>Enable Email Notifications</Label>
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={() => handleSaveSettings("Email")}
                    disabled={saving}
                    className="bg-gradient-to-r from-purple-500 to-purple-600"
                  >
                    {saving ? "Saving..." : "Save Email Settings"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </SimpleTabsContent>

          {/* Security Settings */}
          <SimpleTabsContent value="security">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Platform security and authentication policies</CardDescription>
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
                      <p className="text-sm text-slate-600">Require complex passwords</p>
                    </div>
                    <Switch 
                      checked={securitySettings.requireStrongPassword}
                      onChange={(e) => setSecuritySettings({...securitySettings, requireStrongPassword: e.target.checked})}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Session Timeout (minutes)</Label>
                    <Input
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: e.target.value})}
                      placeholder="30"
                    />
                  </div>
                  <div>
                    <Label>Max Login Attempts</Label>
                    <Input
                      type="number"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: e.target.value})}
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <Label>Minimum Password Length</Label>
                    <Input
                      type="number"
                      value={securitySettings.passwordMinLength}
                      onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: e.target.value})}
                      placeholder="8"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={() => handleSaveSettings("Security")}
                    disabled={saving}
                    className="bg-gradient-to-r from-red-500 to-red-600"
                  >
                    {saving ? "Saving..." : "Save Security Settings"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </SimpleTabsContent>

          {/* Marketplace Settings */}
          <SimpleTabsContent value="marketplace">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Marketplace Settings</CardTitle>
                <CardDescription>Seller policies, fees, and marketplace rules</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div>
                      <p className="font-medium">Enable Registration</p>
                      <p className="text-sm text-slate-600">Allow new user registrations</p>
                    </div>
                    <Switch 
                      checked={marketplaceSettings.enableRegistration}
                      onChange={(e) => setMarketplaceSettings({...marketplaceSettings, enableRegistration: e.target.checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div>
                      <p className="font-medium">Require Seller Approval</p>
                      <p className="text-sm text-slate-600">Admin approval needed for new sellers</p>
                    </div>
                    <Switch 
                      checked={marketplaceSettings.requireSellerApproval}
                      onChange={(e) => setMarketplaceSettings({...marketplaceSettings, requireSellerApproval: e.target.checked})}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Commission Rate (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={marketplaceSettings.commissionRate}
                      onChange={(e) => setMarketplaceSettings({...marketplaceSettings, commissionRate: e.target.value})}
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <Label>Currency</Label>
                    <Select value={marketplaceSettings.currency} onValueChange={(value) => setMarketplaceSettings({...marketplaceSettings, currency: value})}>
                      <SelectContent>
                        <SelectItem value="PHP">Philippine Peso (PHP)</SelectItem>
                        <SelectItem value="USD">US Dollar (USD)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                        <SelectItem value="JPY">Japanese Yen (JPY)</SelectItem>
                        <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
                        <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                        <SelectItem value="SGD">Singapore Dollar (SGD)</SelectItem>
                        <SelectItem value="HKD">Hong Kong Dollar (HKD)</SelectItem>
                        <SelectItem value="CNY">Chinese Yuan (CNY)</SelectItem>
                        <SelectItem value="INR">Indian Rupee (INR)</SelectItem>
                        <SelectItem value="AED">UAE Dirham (AED)</SelectItem>
                        <SelectItem value="SAR">Saudi Riyal (SAR)</SelectItem>
                        <SelectItem value="MYR">Malaysian Ringgit (MYR)</SelectItem>
                        <SelectItem value="THB">Thai Baht (THB)</SelectItem>
                        <SelectItem value="IDR">Indonesian Rupiah (IDR)</SelectItem>
                        <SelectItem value="VND">Vietnamese Dong (VND)</SelectItem>
                        <SelectItem value="BND">Brunei Dollar (BND)</SelectItem>
                        <SelectItem value="NZD">New Zealand Dollar (NZD)</SelectItem>
                        <SelectItem value="ZAR">South African Rand (ZAR)</SelectItem>
                        <SelectItem value="BRL">Brazilian Real (BRL)</SelectItem>
                        <SelectItem value="MXN">Mexican Peso (MXN)</SelectItem>
                        <SelectItem value="KRW">South Korean Won (KRW)</SelectItem>
                        <SelectItem value="TRY">Turkish Lira (TRY)</SelectItem>
                        <SelectItem value="RUB">Russian Ruble (RUB)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Tax Rate (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={marketplaceSettings.taxRate}
                      onChange={(e) => setMarketplaceSettings({...marketplaceSettings, taxRate: e.target.value})}
                      placeholder="12"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={() => handleSaveSettings("Marketplace")}
                    disabled={saving}
                    className="bg-gradient-to-r from-orange-500 to-orange-600"
                  >
                    {saving ? "Saving..." : "Save Marketplace Settings"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </SimpleTabsContent>
        </SimpleTabs>
      </div>
    </div>
  );
};

export default AdminSettings;