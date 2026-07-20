import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import auth from "@/lib/shared/kliv-auth.js";

const AdminDirect = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const currentUser = await auth.getUser();
        console.log("Current user:", currentUser);
        console.log("User groups:", currentUser?.groups);
        
        setUser(currentUser);
        
        if (!currentUser) {
          // Not logged in, redirect to login
          navigate("/login");
          return;
        }

        // Check for admin groups
        const hasAdminGroup = currentUser.groups?.some((g: any) => {
          const groupKey = (g.key || '').toLowerCase();
          const groupName = (g.name || '').toLowerCase();
          console.log(`Checking group: key="${groupKey}", name="${groupName}"`);
          
          return ['team-administrators', 'cross-team-administrator', 'admins', 'admin', 'moderators']
            .some(adminGroup => {
              const match = groupKey.includes(adminGroup) || groupName.includes(adminGroup);
              console.log(`  - Checking "${adminGroup}": ${match}`);
              return match;
            });
        });

        console.log("Has admin group:", hasAdminGroup);

        if (hasAdminGroup) {
          // Has admin access, redirect to admin dashboard
          navigate("/dashboard/admin");
        } else {
          // No admin access, show message
          setChecking(false);
        }
      } catch (err) {
        console.error("Error checking admin access:", err);
        navigate("/login");
      }
    };

    checkAdminAccess();
  }, [navigate]);

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Checking admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin Access Required</h1>
          <p className="text-slate-600 mb-6">
            You don't have admin privileges. Your current groups: {user?.groups?.map((g: any) => g.name).join(", ") || "None"}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/")}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all"
            >
              Go to Homepage
            </button>
            <button
              onClick={() => navigate("/dashboard/seller")}
              className="w-full bg-slate-100 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-200 transition-all"
            >
              Go to Seller Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDirect;