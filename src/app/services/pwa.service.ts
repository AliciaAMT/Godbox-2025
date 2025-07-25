import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private isInstalled = new BehaviorSubject<boolean>(false);
  public isInstalled$ = this.isInstalled.asObservable();

  constructor() {
    this.checkInstallationStatus();
    this.setupInstallationListeners();
  }

  private checkInstallationStatus(): void {
    // Check if running in standalone mode (installed)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled.next(true);
      // Switch to fullscreen mode when installed
      this.switchToFullscreen();
    } else {
      this.isInstalled.next(false);
    }
  }

  private setupInstallationListeners(): void {
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Store the event to trigger installation later
      (window as any).deferredPrompt = e;
    });

    // Listen for appinstalled event
    window.addEventListener('appinstalled', () => {
      this.isInstalled.next(true);
      this.switchToFullscreen();
      // Clear the deferred prompt
      (window as any).deferredPrompt = null;
    });

    // Listen for display mode changes
    window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => {
      if (e.matches) {
        this.isInstalled.next(true);
        this.switchToFullscreen();
      } else {
        this.isInstalled.next(false);
      }
    });
  }

  private switchToFullscreen(): void {
    // Update manifest to fullscreen mode when installed
    const link = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    if (link) {
      // Create a new manifest with fullscreen display
      const manifest = {
        name: "Kahal - Godbox",
        short_name: "Kahal",
        description: "A spiritual growth platform with daily Bible readings, growth blog, and meditation tools",
        start_url: "/",
        display: "fullscreen",
        background_color: "#000000",
        theme_color: "#000000",
        orientation: "portrait-primary",
        scope: "/",
        lang: "en",
        categories: ["lifestyle", "education", "religion"],
        prefer_related_applications: false,
        icons: [
          {
            src: "assets/android/android-launchericon-512-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          },
          {
            src: "assets/android/android-launchericon-192-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "assets/android/android-launchericon-144-144.png",
            sizes: "144x144",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "assets/android/android-launchericon-96-96.png",
            sizes: "96x96",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "assets/android/android-launchericon-72-72.png",
            sizes: "72x72",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "assets/android/android-launchericon-48-48.png",
            sizes: "48x48",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "assets/ios/180.png",
            sizes: "180x180",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "assets/ios/167.png",
            sizes: "167x167",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "assets/ios/152.png",
            sizes: "152x152",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "assets/ios/120.png",
            sizes: "120x120",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "assets/ios/1024.png",
            sizes: "1024x1024",
            type: "image/png",
            purpose: "any"
          }
        ],
        screenshots: [
          {
            src: "assets/images/light.webp",
            sizes: "1280x720",
            type: "image/webp",
            form_factor: "wide",
            label: "Home page of Kahal application"
          }
        ]
      };

      // Create a blob URL for the new manifest
      const blob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      // Update the manifest link
      link.href = url;
    }
  }

  public async installApp(): Promise<void> {
    const deferredPrompt = (window as any).deferredPrompt;
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      (window as any).deferredPrompt = null;
    }
  }

  public canInstall(): boolean {
    return !!(window as any).deferredPrompt;
  }
}
