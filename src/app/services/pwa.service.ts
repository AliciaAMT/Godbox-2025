import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private isInstalled = new BehaviorSubject<boolean>(false);
  public isInstalled$ = this.isInstalled.asObservable();

  private canInstallSubject = new BehaviorSubject<boolean>(false);
  public canInstall$ = this.canInstallSubject.asObservable();

  private updateAvailableSubject = new BehaviorSubject<boolean>(false);
  public updateAvailable$ = this.updateAvailableSubject.asObservable();

  private readonly APP_VERSION = '1.0.1'; // Update this when you deploy new versions

  constructor() {
    console.log('PWA Service: Initializing...');
    this.checkInstallationStatus();
    this.setupInstallationListeners();
    this.setupUpdateListeners();

    // Check installability periodically
    setTimeout(() => {
      this.updateCanInstallStatus();
    }, 1000);

    setTimeout(() => {
      this.updateCanInstallStatus();
    }, 3000);

    // Check for updates weekly
    this.checkForUpdates();

    console.log('PWA Service: Initialized');
  }

  private setupUpdateListeners(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          console.log('PWA: Update available');
          this.updateAvailableSubject.next(true);
        }
      });
    }
  }

  private checkForUpdates(): void {
    if ('serviceWorker' in navigator) {
      // Check for updates every week
      setInterval(() => {
        navigator.serviceWorker.getRegistration().then(registration => {
          if (registration) {
            console.log('PWA: Checking for updates...');
            registration.update();
          }
        });
      }, 7 * 24 * 60 * 60 * 1000); // 7 days
    }
  }

  public forceUpdate(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration && registration.waiting) {
          // Send message to waiting service worker to skip waiting
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    }
  }

  public reloadApp(): void {
    window.location.reload();
  }

  private checkInstallationStatus(): void {
    // Check if running in standalone mode (installed)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled.next(true);
      // Do NOT call switchToFullscreen() here!
    } else {
      this.isInstalled.next(false);
    }
  }

  private setupInstallationListeners(): void {
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('PWA: beforeinstallprompt event fired');
      // Store the event to trigger installation later
      (window as any).deferredPrompt = e;
      // Update canInstall status
      this.updateCanInstallStatus();
    });

    // Listen for service worker registration
    if ('serviceWorker' in navigator) {
      console.log('PWA: Checking Service Worker registrations...');
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        console.log('PWA: Current Service Worker registrations:', registrations);

        // Unregister any existing Service Workers to force a fresh registration
        if (registrations.length > 0) {
          console.log('PWA: Unregistering existing Service Workers...');
          Promise.all(registrations.map(registration => registration.unregister())).then(() => {
            console.log('PWA: Service Workers unregistered, registering fresh...');
            this.registerServiceWorker();
          });
        } else {
          console.log('PWA: No Service Workers registered, attempting to register...');
          this.registerServiceWorker();
        }
      });

      navigator.serviceWorker.ready.then((registration) => {
        console.log('PWA: Service Worker is ready:', registration);
        this.updateCanInstallStatus();
      }).catch((error) => {
        console.log('PWA: Service Worker ready error:', error);
      });
    }

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

    private updateCanInstallStatus(): void {
    try {
      // Check for deferred prompt (Chrome/Edge)
      const hasDeferredPrompt = !!(window as any).deferredPrompt;

      // Check if running in standalone mode (already installed)
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

      // Check if on mobile and can install
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      // Check if HTTPS (required for PWA)
      const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';

      // Additional checks for PWA criteria
      const hasManifest = !!document.querySelector('link[rel="manifest"]');
      const hasServiceWorker = 'serviceWorker' in navigator;

      // Check if service worker is actually registered
      let serviceWorkerRegistered = false;
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          serviceWorkerRegistered = registrations.length > 0;
          console.log('PWA: Service Worker registrations:', registrations);
        });
      }

      const canInstall = hasDeferredPrompt && !isStandalone && isSecure;

      console.log('PWA: updateCanInstallStatus -', {
        hasDeferredPrompt,
        isStandalone,
        isMobile,
        isSecure,
        hasManifest,
        hasServiceWorker,
        serviceWorkerRegistered,
        canInstall,
        userAgent: navigator.userAgent,
        protocol: window.location.protocol,
        hostname: window.location.hostname,
        url: window.location.href
      });

      this.canInstallSubject.next(canInstall);
    } catch (error) {
      console.log('PWA: updateCanInstallStatus error -', error);
      this.canInstallSubject.next(false);
    }
  }

  private registerServiceWorker(): void {
    console.log('PWA: Registering Service Worker...');
    navigator.serviceWorker.register('/ngsw-worker.js', { scope: '/' }).then((registration) => {
      console.log('PWA: Service Worker registration successful:', registration);

      // Wait for the Service Worker to be ready
      if (registration.installing) {
        registration.installing.addEventListener('statechange', () => {
          if (registration.installing?.state === 'installed') {
            console.log('PWA: Service Worker installed and ready');
            this.updateCanInstallStatus();
          }
        });
      } else if (registration.waiting) {
        console.log('PWA: Service Worker waiting, activating...');
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      } else if (registration.active) {
        console.log('PWA: Service Worker is active and ready');
        this.updateCanInstallStatus();
      }

      this.updateCanInstallStatus();
    }).catch((error) => {
      console.log('PWA: Service Worker registration failed:', error);
      this.updateCanInstallStatus();
    });
  }

  public canInstall(): boolean {
    return this.canInstallSubject.value;
  }
}
