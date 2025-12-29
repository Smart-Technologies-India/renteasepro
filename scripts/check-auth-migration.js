/**
 * Migration Script to Update Client Components with Secure Authentication
 * 
 * This script helps identify files that still use the insecure getCookie("id") pattern
 * and provides guidance on how to update them.
 * 
 * Run with: node scripts/check-auth-migration.js
 */

const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  "src/app/dashboard/userrent/page.tsx",
  "src/app/dashboard/userdailybooking/page.tsx",
  "src/app/dashboard/userdailybooking/userbooking/page.tsx",
  "src/app/dashboard/userprofile/edit/page.tsx",
  "src/app/dashboard/userbidhistory/page.tsx",
  "src/app/dashboard/userbids/page.tsx",
  "src/app/dashboard/reports/page.tsx",
  "src/app/dashboard/shops/details/[id]/shopview.tsx",
  "src/app/dashboard/shops/details/[id]/settlerent/page.tsx",
  "src/app/dashboard/shops/add/[id]/addshop.tsx",
  "src/app/dashboard/shops/createrent/[id]/createrentview.tsx",
  "src/app/dashboard/shops/createbid/[id]/createbidview.tsx",
  "src/app/dashboard/shops/createrent/[id]/[userid]/[bidid]/createrentview.tsx",
  "src/app/dashboard/userbids/property/[id]/bigpropertyview.tsx",
  "src/app/dashboard/rents/page.tsx",
  "src/app/dashboard/quickpay/page.tsx",
  "src/app/dashboard/properties/add/page.tsx",
  "src/app/dashboard/rents/edit/[id]/editrent.tsx",
  "src/app/dashboard/page.tsx",
  "src/app/dashboard/miscinvoice/add/page.tsx",
  "src/app/dashboard/miscinvoice/edit/[id]/editinvoice.tsx",
  "src/app/dashboard/miscreceipt/add/page.tsx",
  "src/app/dashboard/miscreceipt/edit/[id]/editreceipt.tsx",
  "src/app/dashboard/dailyshops/collectrent/[rentid]/page.tsx",
  "src/app/dashboard/dailyshops/createbid/[id]/createbidview.tsx",
  "src/app/dashboard/dailyshops/viewrent/[id]/createrentview.tsx",
  "src/app/dashboard/dailyshops/viewrent/[id]/[userid]/createrentview.tsx"
];

console.log("🔍 Checking authentication migration status...\n");

let needsUpdate = 0;
let alreadyUpdated = 0;
let notFound = 0;

filesToUpdate.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    notFound++;
    return;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  
  // Check if file uses old pattern
  if (content.includes('getCookie("id")') && !content.includes('getAuthenticatedUserId')) {
    console.log(`❌ NEEDS UPDATE: ${filePath}`);
    needsUpdate++;
  } else if (content.includes('getAuthenticatedUserId')) {
    console.log(`✅ Already updated: ${filePath}`);
    alreadyUpdated++;
  } else {
    console.log(`✅ No auth needed: ${filePath}`);
    alreadyUpdated++;
  }
});

console.log("\n" + "=".repeat(80));
console.log("📊 Summary:");
console.log(`   ❌ Files needing update: ${needsUpdate}`);
console.log(`   ✅ Files already updated: ${alreadyUpdated}`);
console.log(`   ⚠️  Files not found: ${notFound}`);
console.log("=".repeat(80));

if (needsUpdate > 0) {
  console.log("\n💡 To update a file, follow these steps:");
  console.log("   1. Remove: import { getCookie } from 'cookies-next';");
  console.log("   2. Add: import { getAuthenticatedUserId } from '@/action/auth/getuserid';");
  console.log("   3. Change: const userid: number = parseInt(getCookie('id') ?? '0');");
  console.log("   4. To: const [userid, setUserid] = useState<number>(0);");
  console.log("   5. In useEffect, fetch auth ID:");
  console.log("      const authResponse = await getAuthenticatedUserId();");
  console.log("      if (!authResponse.status) {");
  console.log("        toast.error(authResponse.message);");
  console.log("        return router.push('/login');");
  console.log("      }");
  console.log("      setUserid(authResponse.data);");
  console.log("\n   See SECURITY_MIGRATION_GUIDE.md for detailed examples!");
}
