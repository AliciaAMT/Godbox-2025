import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ESVApiService, ESVPassage } from '../../services/esv-api.service';

export interface HolidayInfo {
  name: string;
  description: string;
  readings?: string[];
  customs: string[] | undefined;
  significance?: string;
}

export interface HolidayReading {
  reference: string;
  passage: ESVPassage | undefined;
  isLoading: boolean;
  error: string | undefined;
}

@Component({
  selector: 'app-holiday-modal',
  templateUrl: './holiday-modal.component.html',
  styleUrls: ['./holiday-modal.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class HolidayModalComponent {
  @Input() isOpen: boolean = false;
  @Input() holidayName: string = '';
  @Output() closeModal = new EventEmitter<void>();

  holidayInfo: HolidayInfo | null = null;
  holidayReadings: HolidayReading[] = [];

  get customsArray(): string[] {
    return this.holidayInfo?.customs || [];
  }

  constructor(private esvApiService: ESVApiService) {}

  ngOnInit() {
    if (this.holidayName) {
      this.loadHolidayInfo(this.holidayName);
    }
  }

  ngOnChanges() {
    if (this.holidayName) {
      this.loadHolidayInfo(this.holidayName);
    }
  }

  onClose() {
    this.closeModal.emit();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  private loadHolidayInfo(holidayName: string) {
    // Check if this is a Rosh Chodesh holiday
    if (holidayName.includes('Rosh Chodesh')) {
      this.loadRoshChodeshInfo(holidayName);
      return;
    }

    // Holiday information database
    const holidayDatabase: { [key: string]: HolidayInfo } = {
      'Rosh Hashanah': {
        name: 'Rosh Hashanah',
        description: 'The Jewish New Year, marking the beginning of the High Holy Days.',
        significance: 'Rosh Hashanah is the "Head of the Year" and begins the ten-day period of repentance leading to Yom Kippur. It commemorates the creation of the world and the beginning of God\'s reign.',
        readings: [
          'Genesis 21:1-34 (First Day)',
          'Genesis 22:1-24 (Second Day)',
          'Numbers 29:1-6 (Both Days)',
          '1 Samuel 1:1-2:10 (First Day)',
          'Jeremiah 31:2-20 (Second Day)'
        ],
        customs: [
          'Blowing the shofar (ram\'s horn)',
          'Eating apples dipped in honey for a sweet year',
          'Tashlich ceremony (casting bread into water)',
          'Wearing white clothing',
          'Attending synagogue services'
        ]
      },
      'Yom Kippur': {
        name: 'Yom Kippur',
        description: 'The Day of Atonement, the holiest day of the Jewish year.',
        significance: 'Yom Kippur is a day of fasting, prayer, and repentance. It is believed that on this day, God seals the fate of each person for the coming year.',
        readings: [
          'Leviticus 16:1-34 (Morning)',
          'Leviticus 18:1-30 (Afternoon)',
          'Numbers 29:7-11 (Both Services)',
          'Isaiah 57:14-58:14 (Morning)',
          'Jonah 1:1-4:11 (Afternoon)'
        ],
        customs: [
          '25-hour fast from sunset to sunset',
          'Wearing white clothing',
          'No leather shoes',
          'No bathing or anointing',
          'No marital relations',
          'Attending synagogue for extended services'
        ]
      },
      'Sukkot': {
        name: 'Sukkot',
        description: 'The Festival of Booths, commemorating the Israelites\' journey through the wilderness.',
        significance: 'Sukkot celebrates the harvest and reminds us of the temporary dwellings the Israelites lived in during their 40-year journey in the wilderness.',
        readings: [
          'Leviticus 22:26-23:44 (First Day)',
          'Leviticus 22:26-23:44 (Second Day)',
          'Numbers 29:12-16 (First Day)',
          'Numbers 29:12-16 (Second Day)',
          'Zechariah 14:1-21 (First Day)',
          '1 Kings 8:2-21 (Second Day)'
        ],
        customs: [
          'Building and dwelling in a sukkah (booth)',
          'Waving the four species (lulav and etrog)',
          'Eating meals in the sukkah',
          'Decorating the sukkah with fruits and vegetables',
          'Special prayers for rain'
        ]
      },
      'Simchat Torah': {
        name: 'Simchat Torah',
        description: 'Rejoicing in the Torah, celebrating the completion of the annual Torah reading cycle.',
        significance: 'Simchat Torah marks the end of one Torah reading cycle and the beginning of the next. It celebrates the joy of Torah study and the continuous cycle of learning.',
        readings: [
          'Deuteronomy 33:1-34:12 (Final portion)',
          'Genesis 1:1-2:3 (Beginning of new cycle)',
          'Numbers 29:35-30:1 (Both portions)',
          'Joshua 1:1-18 (Haftarah)'
        ],
        customs: [
          'Dancing with Torah scrolls',
          'Seven hakafot (circuits) around the synagogue',
          'Calling all congregants to the Torah',
          'Children receiving special blessings',
          'Festive meals and celebrations'
        ]
      },
      'Chanukah': {
        name: 'Chanukah',
        description: 'The Festival of Lights, commemorating the rededication of the Second Temple.',
        significance: 'Chanukah celebrates the victory of the Maccabees over the Seleucid Empire and the miracle of the oil that lasted eight days.',
        readings: [
          'Numbers 7:1-17 (First Day)',
          'Numbers 7:18-29 (Second Day)',
          'Numbers 7:30-41 (Third Day)',
          'Numbers 7:42-53 (Fourth Day)',
          'Numbers 7:54-65 (Fifth Day)',
          'Numbers 7:66-77 (Sixth Day)',
          'Numbers 7:78-89 (Seventh Day)',
          'Numbers 7:84-88 (Eighth Day)',
          'Zechariah 2:14-4:7 (All Days)'
        ],
        customs: [
          'Lighting the menorah for eight nights',
          'Adding one candle each night',
          'Eating foods fried in oil (latkes, sufganiyot)',
          'Playing dreidel',
          'Giving gelt (money) to children'
        ]
      },
      'Purim': {
        name: 'Purim',
        description: 'The Festival of Lots, celebrating the deliverance of the Jewish people from Haman\'s plot.',
        significance: 'Purim commemorates the events described in the Book of Esther, where Queen Esther and her cousin Mordecai saved the Jewish people from destruction.',
        readings: [
          'Esther 1:1-10:3 (Megillat Esther)',
          'Exodus 17:8-16 (Morning)'
        ],
        customs: [
          'Reading the Megillah (Book of Esther)',
          'Wearing costumes and masks',
          'Giving mishloach manot (food gifts)',
          'Giving tzedakah to the poor',
          'Feasting and celebration',
          'Making noise when Haman\'s name is mentioned'
        ]
      },
      'Pesach': {
        name: 'Pesach',
        description: 'Passover, commemorating the Exodus from Egypt and the liberation from slavery.',
        significance: 'Pesach celebrates the Israelites\' liberation from Egyptian slavery and their journey toward the Promised Land. It emphasizes themes of freedom, redemption, and gratitude.',
        readings: [
          'Exodus 12:21-51 (First Day)',
          'Leviticus 22:26-23:44 (First Day)',
          'Numbers 28:16-25 (First Day)',
          'Joshua 3:5-7, 5:2-6:1, 6:27 (First Day)',
          'Exodus 13:1-16 (Second Day)',
          'Leviticus 22:26-23:44 (Second Day)',
          'Numbers 28:16-25 (Second Day)',
          '2 Kings 23:1-9, 21-25 (Second Day)'
        ],
        customs: [
          'Seder meal on first two nights',
          'Eating matzah (unleavened bread)',
          'Removing all chametz (leavened products)',
          'Reading the Haggadah',
          'Four cups of wine',
          'Afikoman (dessert matzah)',
          'Opening the door for Elijah'
        ]
      },
      'Shavuot': {
        name: 'Shavuot',
        description: 'The Festival of Weeks, celebrating the giving of the Torah at Mount Sinai.',
        significance: 'Shavuot commemorates the revelation of the Torah to the Israelites at Mount Sinai, marking the covenant between God and the Jewish people.',
        readings: [
          'Exodus 19:1-20:23 (Morning)',
          'Deuteronomy 15:19-16:17 (Morning)',
          'Numbers 28:26-31 (Morning)',
          'Ezekiel 1:1-28, 3:12 (Morning)',
          'Ruth 1:1-4:22 (Second Day)'
        ],
        customs: [
          'All-night Torah study (Tikkun Leil Shavuot)',
          'Reading the Book of Ruth',
          'Eating dairy foods',
          'Decorating with flowers and greenery',
          'Special prayers for the harvest'
        ]
      },
      'Rosh Chodesh': {
        name: 'Rosh Chodesh',
        description: 'The New Moon, marking the beginning of a new Hebrew month.',
        significance: 'Rosh Chodesh is a minor holiday that celebrates the new moon and the renewal of time. It has special significance for women and is often celebrated with special prayers and meals.',
        readings: [
          'Numbers 28:1-15 (Musaf)',
          'Isaiah 66:1-24 (Haftarah)'
        ],
        customs: [
          'Special Musaf prayer',
          'Women traditionally refrain from work',
          'Festive meals',
          'Special blessings for the new month'
        ]
      }
    };

    this.holidayInfo = holidayDatabase[holidayName] || {
      name: holidayName,
      description: `Information about ${holidayName} is not available in our database.`,
      significance: 'This holiday may be a minor holiday or a custom specific to certain communities.',
      readings: [],
      customs: []
    };

    // Load Bible passages for the holiday
    this.loadHolidayReadings();
  }

  private loadRoshChodeshInfo(holidayName: string) {
    // Extract the month name from "Rosh Chodesh [Month]"
    const monthMatch = holidayName.match(/Rosh Chodesh (.+)/);
    const monthName = monthMatch ? monthMatch[1] : 'Unknown Month';

    // Hebrew month names and their English equivalents
    const hebrewMonths: { [key: string]: string } = {
      'Nisan': 'Nisan',
      'Iyar': 'Iyar',
      'Sivan': 'Sivan',
      'Tammuz': 'Tammuz',
      'Av': 'Av',
      'Elul': 'Elul',
      'Tishrei': 'Tishrei',
      'Cheshvan': 'Cheshvan',
      'Kislev': 'Kislev',
      'Tevet': 'Tevet',
      'Shevat': 'Shevat',
      'Adar': 'Adar',
      'Adar II': 'Adar II'
    };

    const englishMonthName = hebrewMonths[monthName] || monthName;

    this.holidayInfo = {
      name: holidayName,
      description: `Rosh Chodesh ${englishMonthName} - The New Moon, marking the beginning of the Hebrew month of ${englishMonthName}.`,
      significance: `Rosh Chodesh (literally "Head of the Month") celebrates the new moon and the renewal of time. It has special significance for women and is often celebrated with special prayers and meals. The month of ${englishMonthName} brings new opportunities for spiritual growth and renewal.`,
      readings: [
        'Numbers 28:1-15 (Musaf - Additional Offering)',
        'Isaiah 66:1-24 (Haftarah - Prophetic Reading)'
      ],
      customs: [
        'Special Musaf prayer service',
        'Women traditionally refrain from work',
        'Festive meals with family and friends',
        'Special blessings for the new month',
        'Reading Psalms 104 and 148',
        'Lighting candles in honor of the new moon'
      ]
    };

    // Load Bible passages for the holiday
    this.loadHolidayReadings();
  }

  private loadHolidayReadings() {
    if (!this.holidayInfo?.readings) {
      this.holidayReadings = [];
      return;
    }

    this.holidayReadings = this.holidayInfo.readings.map(reference => ({
      reference,
      passage: undefined,
      isLoading: true,
      error: undefined
    }));

    // Load each reading
    this.holidayReadings.forEach((reading, index) => {
      this.esvApiService.getPassage(reading.reference).subscribe({
        next: (passage) => {
          if (passage) {
            this.holidayReadings[index].passage = passage;
          } else {
            this.holidayReadings[index].error = 'Passage not found';
          }
          this.holidayReadings[index].isLoading = false;
        },
        error: (error) => {
          console.error('Error loading passage:', reading.reference, error);
          this.holidayReadings[index].error = 'Failed to load passage';
          this.holidayReadings[index].isLoading = false;
        }
      });
    });
  }
}
