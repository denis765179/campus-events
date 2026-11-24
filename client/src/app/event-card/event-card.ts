
import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CampusEvent } from '../campus-event';
import { NumberValueAccessor } from '@angular/forms';

@Component({
  imports: [DatePipe],
  selector: 'app-event-card',
  styleUrl: './event-card.css',
  templateUrl: './event-card.html',
})
export class EventCard {
  event = input.required<CampusEvent>();
  favourite = input<boolean>(false);
  favouriteToggle = output<number>();
}