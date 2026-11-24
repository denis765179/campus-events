import { Component, computed, signal } from '@angular/core';
import { CampusEvent } from '../campus-event';
import { EventCard } from '../event-card/event-card';

@Component({
  imports: [EventCard],
  selector: 'app-event-list',
  styleUrl: './event-list.css',
  templateUrl: './event-list.html',
})
export class EventList {
  events = signal<CampusEvent[]>([
    {
      id: 1,
      title: 'Welcome party for Erasmus students',
      description: 'Meet the other exchange students, eat pizza and get your welcome pack.',
      date: '2026-10-15T18:00',
      location: 'Main hall, building A',
      capacity: 120,
    },
    {
      id: 2,
      title: 'Hackathon: apps for the city',
      description: 'Build an app that makes life in Kraków easier.',
      date: '2026-11-07T09:00',
      location: 'Lab 204',
      capacity: 40,
    },
    {
      id: 3,
      title: 'Board game night',
      description: '',
      date: '2026-10-22T19:00',
      location: 'Student club',
      capacity: 30,
    },
    {
      id: 4,
      title: 'Movie night',
      description: 'Watch movies or whatever',
      date: '2026-12-22T15:00',
      location: 'Campus movie theater',
      capacity: 25
    },
    {
      id: 5,
      title: 'Cinammon roll baking',
      description: 'Bake',
      date: '2026-02-11T16:00',
      location: 'Campus Kitchen (2nd floor)',
      capacity: 50
    },
    {
      id: 6,
      title: 'GTA VI release',
      description: 'Play the newly released GTA VI with your friends',
      date: '2026-11-19T16:00',
      location: 'Lab296',
      capacity: 10
    }
  ]);

  search = signal('');

  visibleEvents = computed(() => {
    const q = this.search().toLowerCase();
    return this.events().filter((e) => e.title.toLowerCase().includes(q));
  });

  upcomingEvents = computed(() => {
    return this.visibleEvents().filter((e) => new Date(e.date) >= new Date());
  });

  pastEvents = computed(() => {
    return this.visibleEvents().filter((e) => new Date(e.date) < new Date());
  });

  favourites = signal <number[]>([]);

  toggleFavourite(id: number){
    this.favourites.update(list =>
    list.includes(id)
      ? list.filter(x => x !== id)
      : [...list, id]
  );
  }
}