// SP Auth Debugging Script
// Run in browser console to diagnose auth issues

console.log('🔍 SP AUTH DEBUGGING STARTED');
console.log('============================');

// Environment detection
function checkEnvironment() {
    console.log('🌐 Environment Check:');
    console.log('  Hostname:', window.location.hostname);
    console.log('  Protocol:', window.location.protocol);
    console.log('  In iframe:', window.self !== window.top);
    console.log('  User agent:', navigator.userAgent.substring(0, 100));
    
    // Firebase Studio detection
    const isFirebaseStudio = window.location.hostname.includes('cloudworkstations.dev');
    console.log('  Firebase Studio:', isFirebaseStudio);
    
    if (isFirebaseStudio) {
        console.log('  ⚠️ Firebase Studio detected - popup auth required');
    }
}

// Firebase config check
function checkFirebaseConfig() {
    console.log('🔥 Firebase Config Check:');
    
    if (typeof window.firebase !== 'undefined') {
        console.log('  Firebase SDK loaded:', !!window.firebase);
    }
    
    // Check environment variables (if available)
    const requiredVars = [
        'NEXT_PUBLIC_FIREBASE_API_KEY',
        'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
        'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
    ];
    
    console.log('  Environment variables:');
    requiredVars.forEach(varName => {
        const value = process?.env?.[varName] || 'Not available in browser';
        console.log(`    ${varName}:`, value.substring(0, 20) + '...');
    });
}

// Network connectivity check
async function checkNetworkConnectivity() {
    console.log('🌐 Network Connectivity Check:');
    
    try {
        const response = await fetch('https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=test', {
            method: 'HEAD',
            mode: 'no-cors'
        });
        console.log('  Google APIs accessible: ✅');
    } catch (error) {
        console.log('  Google APIs accessible: ❌', error.message);
    }
    
    try {
        const response = await fetch('https://accounts.google.com', {
            method: 'HEAD',
            mode: 'no-cors'
        });
        console.log('  Google Accounts accessible: ✅');
    } catch (error) {
        console.log('  Google Accounts accessible: ❌', error.message);
    }
}

// Test popup functionality
function testPopupBlocking() {
    console.log('🪟 Popup Blocking Test:');
    
    try {
        const popup = window.open('', '_blank', 'width=1,height=1');
        if (popup) {
            popup.close();
            console.log('  Popups allowed: ✅');
        } else {
            console.log('  Popups blocked: ❌');
        }
    } catch (error) {
        console.log('  Popup test error:', error.message);
    }
}

// Run all checks
async function runAllChecks() {
    checkEnvironment();
    checkFirebaseConfig();
    testPopupBlocking();
    await checkNetworkConnectivity();
    
    console.log('🎯 Debug Summary:');
    console.log('  If popups are blocked, enable them for this site');
    console.log('  If network issues, check firewall/proxy settings');
    console.log('  If iframe issues, try opening in new tab');
}

runAllChecks();
