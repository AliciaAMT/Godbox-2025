import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly API_KEY_STORAGE_KEY = 'api_bible_key';
  private readonly DEFAULT_API_KEY = 'YOUR_API_KEY_HERE';

  constructor() { }

  /**
   * Get the api.bible API key from localStorage or return default
   */
  getApiBibleKey(): string {
    const storedKey = localStorage.getItem(this.API_KEY_STORAGE_KEY);
    return storedKey || this.DEFAULT_API_KEY;
  }

  /**
   * Set the api.bible API key in localStorage
   */
  setApiBibleKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
  }

  /**
   * Check if API key is configured
   */
  isApiKeyConfigured(): boolean {
    const key = this.getApiBibleKey();
    return key !== this.DEFAULT_API_KEY && key.trim() !== '';
  }

  /**
   * Clear the stored API key
   */
  clearApiKey(): void {
    localStorage.removeItem(this.API_KEY_STORAGE_KEY);
  }
}
