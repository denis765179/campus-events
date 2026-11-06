import express from 'express';

const app = express();
app.use(express.json());

let events = [
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
    description: 'Build an app that makes life in Kraków easier. Teams of 3 to 5, prizes for the top three.',
    date: '2026-11-07T09:00',
    location: 'Lab 204',
    capacity: 40,
  },
  {
    id: 3,
    title: 'Board game night',
    description: 'Bring your favourite game or learn a new one. Beginners welcome.',
    date: '2026-10-22T19:00',
    location: 'Student club',
    capacity: 30,
  },
];
let nextId = 4;

function validateEvent(body) {
  const errors = [];
  if (typeof body.title !== 'string' || body.title.trim().length < 3) {
    errors.push('title must have at least 3 characters');
  }
  if (typeof body.date !== 'string' || Number.isNaN(Date.parse(body.date)) || new Date(body.date) < new Date() ) {
    errors.push('date must be valid and in the future, e.g. 2026-10-15T18:00');
  }
  if (!Number.isInteger(body.capacity) || body.capacity < 1) {
    errors.push('capacity must be a whole number greater than 0');
  }
  if(body.title.length > 120){
    errors.push("title can have at most 120 characters.");
  }
  if(Object.hasOwn(body, "location")){
    if(body.location.length > 100){
      errors.push("location can have at most 100 characters.");
    }
  }
  if(Object.hasOwn(body, "description")){
    if(body.description.length > 1000) errors.push("description can have at most 1000 characters.");
  }
  if(errors.length > 0){
    return errors;
  }
  return null;
}

function toEvent(id, body) {
  return {
    id,
    title: body.title.trim(),
    description: body.description ?? '',
    date: body.date,
    location: body.location ?? '',
    capacity: body.capacity,
  };
}

app.get('/api/events', (req, res) => {
  const q = String(req.query.q ?? '').toLowerCase();
  const from = String(req.query.from ?? '');
  const from_date = new Date(from);
  if(from !== '' && isNaN(from_date.getTime())){
    return res.status(400).json({error: `Invalid Date: "${from} "is not a valid date format.`})
  }
  const sort = String(req.query.sort ?? '');
  const result = events
    .filter((e) => e.title.toLowerCase().includes(q))
    .filter((e) => from === '' ? e : new Date(e.date) >= from_date)
    .sort((a, b) => sort === ''? a.date.localeCompare(b.date): a.title.localeCompare(b.title));
  res.json(result);
});

app.get('/api/events/:id', (req, res) => {
  const event = events.find((e) => e.id === Number(req.params.id));
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  res.json(event);
});

app.post('/api/events', (req, res) => {
  const error = validateEvent(req.body);
  if (error) {
    return res.status(400).json({ error });
  }
  const event = toEvent(nextId++, req.body);
  events.push(event);
  res.status(201).json(event);
});

app.put('/api/events/:id', (req, res) => {
  const index = events.findIndex((e) => e.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Event not found' });
  }
  const error = validateEvent(req.body);
  if (error) {
    return res.status(400).json({ error });
  }
  events[index] = toEvent(events[index].id, req.body);
  res.json(events[index]);
});

app.delete('/api/events/:id', (req, res) => {
  const before = events.length;
  events = events.filter((e) => e.id !== Number(req.params.id));
  if (events.length === before) {
    return res.status(404).json({ error: 'Event not found' });
  }
  res.status(204).end();
});

app.get('/api/stats', (req,res) => {
  const totalCapacity = events.reduce((acc, event) => {
    return acc + event.capacity}, 0);
  const n = events.length;
  //gets the next event in the future
  const next = events.reduce((acc, event) => {
    if(new Date(event.date) > new Date() && (acc == null ? true : acc.date > event.date)){
      return event;
    }
      return acc;
  }, null);

  if(next != null){
    const {location, capacity, description, ...nextEvent} = next;
    res.json({n, totalCapacity, nextEvent});
  }
  else{
    res.json({n, totalCapacity, next});
  }
})
app.listen(3000, () => {
  console.log('API running on http://localhost:3000');
});
