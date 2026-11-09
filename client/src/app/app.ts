import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EventList } from './event-list/event-list';
@Component({
  imports: [RouterOutlet, EventList],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
}
