const fs = require('fs');
const path = require('path');

const componentsDir = '/app/src/pages';
const componentsDir2 = '/app/src/components';

// Files to update
const filesToUpdate = [
  // Avatar imports
  '/app/src/pages/DriverManagement.tsx',
  '/app/src/pages/ShopOwnerManagement.tsx', 
  '/app/src/pages/ShopOwnerPaymentManagement.tsx',
  '/app/src/pages/UserManagement.tsx',
  '/app/src/pages/WithdrawalManagement.tsx',
  // Select imports (all pages)
  '/app/src/pages/AdminSettings.tsx',
  '/app/src/pages/CategoryManagement.tsx',
  '/app/src/pages/ComplaintManagement.tsx',
  '/app/src/pages/DeliveryManagement.tsx',
  '/app/src/pages/DeliveryOptionsManagement.tsx',
  '/app/src/pages/DriverManagement.tsx',
  '/app/src/pages/OrderManagement.tsx',
  '/app/src/pages/PaymentGatewayManagement.tsx',
  '/app/src/pages/ProductModeration.tsx',
  '/app/src/pages/ReviewManagement.tsx',
  '/app/src/pages/ShopOwnerDocuments.tsx',
  '/app/src/pages/ShopOwnerPaymentManagement.tsx',
  '/app/src/pages/UserManagement.tsx',
  '/app/src/pages/WithdrawalManagement.tsx',
  // Radio group
  '/app/src/pages/Register.tsx',
  // Switch
  '/app/src/pages/AdminSettings.tsx',
  '/app/src/pages/Security.tsx'
];

filesToUpdate.forEach(filePath => {
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Replace avatar imports
      content = content.replace(
        /from\s+["']@\/components\/ui\/avatar["']/g,
        'from "@/components/ui/avatar-custom"'
      );
      
      // Replace select imports
      content = content.replace(
        /from\s+["']@\/components\/ui\/select["']/g,
        'from "@/components/ui/select-custom"'
      );
      
      // Replace radio-group imports
      content = content.replace(
        /from\s+["']@\/components\/ui\/radio-group["']/g,
        'from "@/components/ui/radio-group-custom"'
      );
      
      // Replace switch imports
      content = content.replace(
        /from\s+["']@\/components\/ui\/switch["']/g,
        'from "@/components/ui/switch-custom"'
      );
      
      // Replace checkbox imports
      content = content.replace(
        /from\s+["']@\/components\/ui\/checkbox["']/g,
        'from "@/components/ui/checkbox-custom"'
      );
      
      fs.writeFileSync(filePath, content);
      console.log(`Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
  }
});

console.log('Imports update completed!');
