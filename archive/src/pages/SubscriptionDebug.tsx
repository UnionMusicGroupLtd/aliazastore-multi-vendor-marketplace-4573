import { useEffect, useState } from "react";
import auth from "@/lib/shared/kliv-auth.js";
import db from "@/lib/shared/kliv-database.js";

const SubscriptionDebug = () => {
  const [user, setUser] = useState<any>(null);
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const debug = async () => {
      try {
        setLoading(true);
        
        // Check authentication
        const currentUser = await auth.getUser();
        console.log("Current user:", currentUser);
        setUser(currentUser);

        if (!currentUser) {
          setError("No user authenticated");
          setLoading(false);
          return;
        }

        // Try to find stores
        const storesByUuid = await db.query("stores", { owner_uuid: `eq.${currentUser.userUuid}` });
        const storesByEmail = await db.query("stores", { owner_email: `eq.${currentUser.email}` });
        
        console.log("Stores by UUID:", storesByUuid);
        console.log("Stores by email:", storesByEmail);
        
        const allStores = [...storesByUuid, ...storesByEmail];
        setStores(allStores);

        if (allStores.length === 0) {
          setError("No stores found for user");
        } else {
          setError("");
        }
      } catch (err: any) {
        console.error("Debug error:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    debug();
  }, []);

  if (loading) {
    return <div className="p-8">Loading debug information...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Subscription Debug Page</h1>
        
        {/* User Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">User Authentication</h2>
          {user ? (
            <div className="space-y-2">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>User UUID:</strong> {user.userUuid}</p>
              <p><strong>Name:</strong> {user.name || "Not set"}</p>
              <p className="text-green-600 font-semibold">✅ User is authenticated</p>
            </div>
          ) : (
            <p className="text-red-600 font-semibold">❌ No user authenticated</p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-semibold">Error: {error}</p>
          </div>
        )}

        {/* Store Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Store Information ({stores.length} stores found)</h2>
          {stores.length > 0 ? (
            <div className="space-y-4">
              {stores.map((store, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Store #{index + 1}: {store.name}</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><strong>Store ID:</strong> {store._row_id}</div>
                    <div><strong>Owner Email:</strong> {store.owner_email || "Not set"}</div>
                    <div><strong>Owner UUID:</strong> {store.owner_uuid}</div>
                    <div><strong>Status:</strong> {store.subscription_status || "Not set"}</div>
                    <div><strong>Trial Start:</strong> {store.trial_start_date ? new Date(store.trial_start_date * 1000).toLocaleDateString() : "Not set"}</div>
                    <div><strong>Trial End:</strong> {store.trial_end_date ? new Date(store.trial_end_date * 1000).toLocaleDateString() : "Not set"}</div>
                    <div className="col-span-2"><strong>QR Code:</strong> {store.store_qr_code || "Not set"}</div>
                  </div>
                </div>
              ))}
              <p className="text-green-600 font-semibold">✅ Stores found - subscription page should work</p>
            </div>
          ) : (
            <p className="text-red-600 font-semibold">❌ No stores found - subscription page will show "No Store Found"</p>
          )}
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Actions</h2>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = '/dashboard/seller/subscription'}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Go to Subscription Page
            </button>
            <button 
              onClick={() => window.location.href = '/dashboard/seller'}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 ml-3"
            >
              Go to Seller Dashboard
            </button>
            <button 
              onClick={() => window.location.href = '/login'}
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 ml-3"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDebug;