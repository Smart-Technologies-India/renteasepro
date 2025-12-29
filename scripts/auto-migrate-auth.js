#!/usr/bin/env node

/**
 * Automated Migration Tool for Auth Security Fix
 * 
 * This tool helps semi-automate the migration process by showing you
 * what needs to be changed in each file.
 * 
 * Usage: node scripts/auto-migrate-auth.js <filename>
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("Usage: node scripts/auto-migrate-auth.js <filepath>");
  console.log("\nExample:");
  console.log("  node scripts/auto-migrate-auth.js src/app/dashboard/userrent/page.tsx");
  process.exit(1);
}

const filePath = args[0];
const fullPath = path.join(process.cwd(), filePath);

if (!fs.existsSync(fullPath)) {
  console.error(`Error: File not found: ${filePath}`);
  process.exit(1);
}

let content = fs.readFileSync(fullPath, 'utf8');

// Check if already migrated
if (content.includes('getAuthenticatedUserId')) {
  console.log("✅ This file appears to already be migrated!");
  process.exit(0);
}

// Check if file uses getCookie("id")
if (!content.includes('getCookie("id")')) {
  console.log("ℹ️  This file doesn't use getCookie('id')");
  process.exit(0);
}

console.log("🔧 Analyzing file...\n");

// Step 1: Remove getCookie import if it's the only thing from cookies-next
if (content.includes("import { getCookie } from 'cookies-next'") || 
    content.includes('import { getCookie } from "cookies-next"')) {
  console.log("Step 1: Remove getCookie import");
  content = content.replace(/import\s+{\s*getCookie\s*}\s+from\s+['"]cookies-next['"];?\n?/g, '');
}

// Step 2: Add new imports
console.log("Step 2: Add getAuthenticatedUserId import");
const importStatement = 'import { getAuthenticatedUserId } from "@/action/auth/getuserid";\n';

// Find a good place to add the import (after other imports)
const lastImportIndex = content.lastIndexOf('import ');
if (lastImportIndex !== -1) {
  const endOfLine = content.indexOf('\n', lastImportIndex);
  content = content.slice(0, endOfLine + 1) + importStatement + content.slice(endOfLine + 1);
}

// Step 3: Find and replace userid declarations
console.log("Step 3: Replace userid declaration");
const useridPattern = /const\s+(userid|id|current_user_id|createuserid|currentuserid)\s*:\s*number\s*=\s*parseInt\(.*?getCookie\(["']id["']\).*?\)/g;
const matches = content.match(useridPattern);

if (matches) {
  matches.forEach(match => {
    const varName = match.match(/const\s+(\w+)/)[1];
    const replacement = `const [${varName}, set${varName.charAt(0).toUpperCase() + varName.slice(1)}] = useState<number>(0)`;
    content = content.replace(match, replacement);
    console.log(`   - Changed ${varName} to useState`);
  });
}

// Step 4: Add useState import if not present
if (!content.includes('useState')) {
  content = content.replace(
    /from\s+['"]react['"]/,
    match => match.replace('from "react"', ', useState } from "react"')
  );
}

// Write the modified content
fs.writeFileSync(fullPath, content, 'utf8');

console.log("\n✅ Basic migration completed!");
console.log("\n⚠️  MANUAL STEPS STILL REQUIRED:");
console.log("   1. In your useEffect, add authentication check at the beginning:");
console.log("      ```");
console.log("      const authResponse = await getAuthenticatedUserId();");
console.log("      if (!authResponse.status) {");
console.log("        toast.error(authResponse.message);");
console.log("        return router.push('/login');");
console.log("      }");
console.log("      const authenticatedUserId = authResponse.data;");
console.log("      set[YourVariableName](authenticatedUserId);");
console.log("      ```");
console.log("   2. Replace all uses of the old variable name with the new state variable");
console.log("   3. Make sure to import useRouter if not already imported");
console.log("   4. Test the page thoroughly!");
console.log("\n📝 See SECURITY_MIGRATION_GUIDE.md for detailed examples");
