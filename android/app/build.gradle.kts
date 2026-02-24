plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.example.opentodo"
    compileSdk = 34

    buildFeatures {
        buildConfig = true
    }

    defaultConfig {
        applicationId = "com.example.opentodo"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
        buildConfigField("String", "BACKEND_URL", "\"http://192.168.3.12:3000/lists\"")
    }

    signingConfigs {
        create("release") {
            val keystorePath = System.getenv("KEYSTORE_FILE")
            if (keystorePath != null) {
                storeFile = file(keystorePath)
                storePassword = System.getenv("KEYSTORE_PASSWORD")
                keyAlias = System.getenv("KEY_ALIAS")
                keyPassword = System.getenv("KEY_PASSWORD")
            }
        }
    }

    buildTypes {
        getByName("release") {
            signingConfig = signingConfigs.getByName("release")
            isMinifyEnabled = false
            isShrinkResources = false
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.11.0")
    implementation("androidx.fragment:fragment-ktx:1.6.2")
    implementation("androidx.recyclerview:recyclerview:1.3.2")
    implementation("androidx.viewpager2:viewpager2:1.1.0")
}
