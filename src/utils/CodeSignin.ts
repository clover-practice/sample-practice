// Android: Code Signing (APK/AAB)
// React Native Android apps are just native Android apps under the hood, so code signing is done in Gradle using a keystore file.

// Step 1: Generate a Keystore ====================
// bash
// Copy
// Edit
// keytool -genkey -v -keystore my-release-key.keystore \
//   -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
// Save my-release-key.keystore securely.

// Backup the keystore and password.

// Step 2: Place Keystore in Android Folder  ====================
// android / app / my - release - key.keystore

// Step 3: Update android / gradle.properties  ====================
// MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
// MYAPP_RELEASE_KEY_ALIAS=my-key-alias
// MYAPP_RELEASE_STORE_PASSWORD=your-keystore-password
// MYAPP_RELEASE_KEY_PASSWORD = your - key - password

// Step 4: Update android / app / build.gradle  ====================

// android {
//     ...
//     signingConfigs {
//         release {
//             if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
//                 storeFile file(MYAPP_RELEASE_STORE_FILE)
//                 storePassword MYAPP_RELEASE_STORE_PASSWORD
//                 keyAlias MYAPP_RELEASE_KEY_ALIAS
//                 keyPassword MYAPP_RELEASE_KEY_PASSWORD
//             }
//         }
//     }
//     buildTypes {
//         release {
//             signingConfig signingConfigs.release
//             shrinkResources true
//             minifyEnabled true
//             proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
//         }
//     }
// }
