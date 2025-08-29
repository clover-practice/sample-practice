# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# --- Google Play Services Auth & Credentials API ---
-keep class com.google.android.gms.auth.api.credentials.** { *; }
-dontwarn com.google.android.gms.auth.api.credentials.**

# --- Google Play Services SMS Retriever API ---
-keep class com.google.android.gms.auth.api.phone.** { *; }
-dontwarn com.google.android.gms.auth.api.phone.**

# --- Keep your SMS retriever helper classes ---
-keep class me.furtado.smsretriever.** { *; }
-dontwarn me.furtado.smsretriever.**

# --- (Optional) Keep Kotlin Metadata ---
-keepclassmembers class kotlin.Metadata { *; }
