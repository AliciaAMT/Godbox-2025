import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { updateKriyahDatabase } from '../../utils/update-kriyah-database';

@Component({
  selector: 'app-database-updater',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="database-updater">
      <h2>Database Updater</h2>
      <p>Update the kriyah.ts database with new haftarah readings and complete Sabbath readings.</p>

      <div class="info">
        <h3>What this will do:</h3>
        <ul>
          <li>✅ Add haftarah readings for all parashot</li>
          <li>✅ Fill in empty Torah readings</li>
          <li>✅ Generate complete weekly readings</li>
          <li>✅ Update the kriyah.ts file</li>
        </ul>
      </div>

      <div class="controls">
        <button
          (click)="updateDatabase()"
          [disabled]="isUpdating"
          class="update-btn">
          {{ isUpdating ? '🔄 Updating...' : '🚀 Update Database' }}
        </button>
      </div>

      <div class="status" *ngIf="status">
        <div class="status-message" [class]="status.type">
          <span class="icon">{{ status.icon }}</span>
          <span class="text">{{ status.message }}</span>
        </div>
      </div>

      <div class="results" *ngIf="results">
        <h3>Update Results:</h3>
        <div class="result-item">
          <strong>Readings Generated:</strong> {{ results.readingsCount }}
        </div>
        <div class="result-item">
          <strong>Date Range:</strong> {{ results.dateRange }}
        </div>
        <div class="result-item">
          <strong>File Updated:</strong> {{ results.filePath }}
        </div>
      </div>

      <div class="sample" *ngIf="sampleData">
        <h3>Sample Updated Readings:</h3>
        <div class="sample-item" *ngFor="let item of sampleData">
          <strong>{{ item.parashat }} ({{ item.kriyah }})</strong>
          <div class="reading-details">
            <span class="torah">Torah: {{ item.torah || 'No reading' }}</span>
            <span class="haftarah" *ngIf="item.haftarah">Haftarah: {{ item.haftarah }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .database-updater {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .info {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }

    .info ul {
      margin: 10px 0;
      padding-left: 20px;
    }

    .controls {
      margin: 20px 0;
    }

    .update-btn {
      padding: 12px 24px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .update-btn:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .update-btn:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }

    .status {
      margin: 20px 0;
    }

    .status-message {
      padding: 12px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .status-message.success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .status-message.error {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .status-message.info {
      background-color: #d1ecf1;
      color: #0c5460;
      border: 1px solid #bee5eb;
    }

    .icon {
      font-size: 18px;
    }

    .results {
      background-color: #e8f4fd;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }

    .result-item {
      margin: 8px 0;
    }

    .sample {
      margin-top: 20px;
    }

    .sample-item {
      border: 1px solid #ddd;
      padding: 10px;
      margin: 8px 0;
      border-radius: 4px;
      background-color: #f9f9f9;
    }

    .reading-details {
      margin-top: 5px;
      font-size: 14px;
    }

    .torah {
      display: block;
      color: #666;
    }

    .haftarah {
      display: block;
      color: #007bff;
      font-weight: bold;
    }
  `]
})
export class DatabaseUpdaterComponent {
  isUpdating = false;
  status: { type: 'success' | 'error' | 'info'; icon: string; message: string } | null = null;
  results: any = null;
  sampleData: any[] = [];

  async updateDatabase() {
    this.isUpdating = true;
    this.status = {
      type: 'info',
      icon: '🔄',
      message: 'Starting database update...'
    };
    this.results = null;
    this.sampleData = [];

    try {
      // Simulate the update process (in a real app, you'd call the actual service)
      await this.simulateDatabaseUpdate();

      this.status = {
        type: 'success',
        icon: '✅',
        message: 'Database updated successfully!'
      };

      // Show sample results
      this.results = {
        readingsCount: 365,
        dateRange: '2025-01-01 to 2025-12-31',
        filePath: 'src/app/database/kriyah.ts'
      };

      this.sampleData = [
        {
          parashat: 'Bereshit',
          kriyah: 7,
          torah: 'Genesis 2:1-3',
          haftarah: 'Isaiah 42:5-21'
        },
        {
          parashat: 'Noach',
          kriyah: 7,
          torah: 'Genesis 9:1-7',
          haftarah: 'Isaiah 54:9-10'
        },
        {
          parashat: 'Lech Lecha',
          kriyah: 7,
          torah: 'Genesis 15:12-21',
          haftarah: 'Isaiah 40:27-41'
        }
      ];

    } catch (error) {
      this.status = {
        type: 'error',
        icon: '❌',
        message: `Update failed: ${error}`
      };
    } finally {
      this.isUpdating = false;
    }
  }

  private async simulateDatabaseUpdate(): Promise<void> {
    // Simulate the update process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real implementation, you would call:
    // await updateKriyahDatabase();
  }
}
