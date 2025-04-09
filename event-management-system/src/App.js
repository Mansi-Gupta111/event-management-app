import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const EventManagement = () => {
  // Sample Indian cities for location autocomplete
  const indianCities = [
   "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad",
  "Chennai", "Kolkata", "Surat", "Pune", "Jaipur",
  "Lucknow", "Kanpur", "Nagpur", "Visakhapatnam", "Indore",
  "Thane", "Bhopal", "Patna", "Vadodara", "Ghaziabad",
  "Ludhiana", "Coimbatore", "Agra", "Madurai", "Nashik",
  "Faridabad", "Meerut", "Rajkot", "Varanasi", "Srinagar",
  "Aurangabad", "Dhanbad", "Amritsar", "Navi Mumbai", "Allahabad",
  "Howrah", "Gwalior", "Jabalpur", "Vijayawada", "Jodhpur",
  "Raipur", "Kota", "Guwahati", "Chandigarh", "Solapur",
  "Hubli-Dharwad", "Bareilly", "Moradabad", "Mysore", "Gurgaon",
  "Aligarh", "Jalandhar", "Tiruchirappalli", "Bhubaneswar", "Salem",
  "Warangal", "Guntur", "Bhiwandi", "Saharanpur", "Gorakhpur",
  "Bikaner", "Amravati", "Noida", "Jamshedpur", "Bhilai",
  "Cuttack", "Firozabad", "Kochi", "Goa", "Shimla",
  "Dehradun", "Imphal", "Agartala", "Aizawl", "Itanagar",
  "Kohima", "Shillong", "Gangtok", "Port Blair", "Silvassa",
  "Daman", "Pondicherry", "Kavaratti", "New Delhi"
  ];

  const [events, setEvents] = useState([
    { id: 1, title: 'bday', date: '2025-05-14T18:00', location: 'Bangalore', description: 'Birthday party' }
  ]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: ''
  });

  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });

    // Location autocomplete
    if (name === 'location' && value.length > 1) {
      const filtered = indianCities.filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      );
      setLocationSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Add new event
  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;

    const eventDateTime = `${newEvent.date}T${newEvent.time || '12:00'}`;
    
    const event = {
      id: Date.now(),
      title: newEvent.title,
      date: eventDateTime,
      location: newEvent.location,
      description: newEvent.description
    };

    setEvents([...events, event]);
    setNewEvent({
      title: '',
      date: '',
      time: '',
      location: '',
      description: ''
    });

    toast.success('Event added successfully!');
  };

  // Delete event
  const handleDeleteEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
    toast.error('Event deleted!');
  };

  // Calculate time left for each event
  const calculateTimeLeft = (eventDate) => {
    const now = new Date();
    const eventTime = new Date(eventDate);
    const diff = eventTime - now; // Difference in milliseconds
  
    if (diff <= 0) {
      return { 
        status: 'ended', 
        text: 'Event ended', 
        days: 0, 
        hours: 0, 
        minutes: 0 
      };
    }
  
    // Corrected time calculations with proper parentheses
    const totalMinutes = Math.floor(diff / (1000 * 60));
    const totalHours = Math.floor(totalMinutes / 60);
    
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
  
    let status = 'upcoming';
    if (days === 0 && hours < 24) status = 'soon';
    if (days === 0 && hours < 1) status = 'imminent';
  
    return {
      status,
      days,
      hours,
      minutes,
      text: `${days > 0 ? `${days}d ` : ''}${hours}h ${minutes}m left`
    };
  };

  // Check for upcoming events
  useEffect(() => {
    const checkEvents = () => {
      events.forEach(event => {
        const timeLeft = calculateTimeLeft(event.date);
        
        // Notify if event is within 1 hour
        if (timeLeft.status === 'imminent' && timeLeft.minutes < 60) {
          toast.warning(`"${event.title}" is starting soon!`);
        }
        
        // Notify when event time arrives
        if (timeLeft.status === 'ended') {
          toast.info(`"${event.title}" has ended`);
        }
      });
    };

    const interval = setInterval(checkEvents, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [events]);

  return (
    <div className="event-management">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="glass-container">
        <h1>Event Management System</h1>
        
        <form onSubmit={handleAddEvent} className="event-form">
          <div className="form-group">
            <input
              type="text"
              name="title"
              value={newEvent.title}
              onChange={handleInputChange}
              placeholder="Event Title"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <input
                type="date"
                name="date"
                value={newEvent.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="time"
                name="time"
                value={newEvent.time}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="form-group location-group">
            <input
              type="text"
              name="location"
              value={newEvent.location}
              onChange={handleInputChange}
              placeholder="Location"
              autoComplete="off"
            />
            {showSuggestions && (
              <ul className="suggestions">
                {locationSuggestions.map((city, i) => (
                  <li key={i} onClick={() => {
                    setNewEvent({...newEvent, location: city});
                    setShowSuggestions(false);
                  }}>
                    {city}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="form-group">
            <textarea
              name="description"
              value={newEvent.description}
              onChange={handleInputChange}
              placeholder="Description"
            />
          </div>
          
          <button type="submit" className="add-btn">
            Add Event
          </button>
        </form>
        
        <div className="events-container">
          {events.map(event => {
            const timeLeft = calculateTimeLeft(event.date);
            const eventDate = new Date(event.date);
            
            return (
              <div key={event.id} className={`event-card ${timeLeft.status}`}>
                <div className="event-header">
                  <h3>{event.title}</h3>
                  <button 
                    onClick={() => handleDeleteEvent(event.id)}
                    className="delete-btn"
                  >
                    ×
                  </button>
                </div>
                
                <div className="event-details">
                  <p>
                    <span className="detail-label">Date:</span>
                    {eventDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <p>
                    <span className="detail-label">Time:</span>
                    {eventDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {event.location && (
                    <p>
                      <span className="detail-label">Location:</span>
                      {event.location}
                    </p>
                  )}
                  {event.description && (
                    <p>
                      <span className="detail-label">Description:</span>
                      {event.description}
                    </p>
                  )}
                </div>
                
                <div className={`time-left ${timeLeft.status}`}>
                  {timeLeft.status === 'ended' ? (
                    <span>Event ended</span>
                  ) : (
                    <span>
                      {timeLeft.days > 0 && `${timeLeft.days}d `}
                      {timeLeft.hours > 0 && `${timeLeft.hours}h `}
                      {timeLeft.minutes > 0 && `${timeLeft.minutes}m`}
                      {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 ? 'Starting now!' : 'left'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EventManagement;