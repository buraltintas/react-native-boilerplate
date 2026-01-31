/**
 * iOS Deep Linking Configuration
 * 
 * Add this to your Info.plist:
 * 
 * <key>CFBundleURLTypes</key>
 * <array>
 *   <dict>
 *     <key>CFBundleURLSchemes</key>
 *     <array>
 *       <string>myapp</string>
 *     </array>
 *   </dict>
 * </array>
 * 
 * For Universal Links (https://), add:
 * 
 * <key>com.apple.developer.associated-domains</key>
 * <array>
 *   <string>applinks:myapp.com</string>
 * </array>
 * 
 * Then create an apple-app-site-association file on your server:
 * https://myapp.com/.well-known/apple-app-site-association
 * 
 * {
 *   "applinks": {
 *     "apps": [],
 *     "details": [
 *       {
 *         "appID": "TEAM_ID.BUNDLE_ID",
 *         "paths": ["*"]
 *       }
 *     ]
 *   }
 * }
 */

export const IOS_DEEP_LINKING_INSTRUCTIONS = `
See the comment in this file for iOS deep linking setup instructions.
Add the configuration to your ios/YourApp/Info.plist file.
`;
