import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, CalendarCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import './HomePage.scss';

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3
        }
    }
};

const HomePage = ({ history }) => {
    const [formData, setFormData] = useState({
        location: '',
        checkIn: '',
        checkOut: '',
        guests: 1
    });
    const [isLoaded, setIsLoaded] = useState(false);
    const [calendarOpen, setCalendarOpen] = useState({
        checkIn: false,
        checkOut: false
    });

    // Calculate tomorrow's date for minimum check-out date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Calculate today's date for minimum check-in date
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        // Set loaded state after a short delay for animations
        setTimeout(() => setIsLoaded(true), 100);
    }, []);

    // date manipulation 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // If check-in date changes, ensure check-out date is not before it
        if (name === "checkIn" && value) {
            const checkInDate = new Date(value);
            const nextDay = new Date(checkInDate);
            nextDay.setDate(checkInDate.getDate() + 1);

            if (new Date(formData.checkOut) <= checkInDate) {
                setFormData(prev => ({
                    ...prev,
                    checkOut: nextDay.toISOString().split('T')[0]
                }));
            }
        }
    };
    // Handle Calendar
    const handleCalendarToggle = (field) => {
        setCalendarOpen(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };
    // form submit handler 
    const handleSubmit = (e) => {
        e.preventDefault();

        // Generate a unique ID for the booking
        const bookingId = Date.now().toString();

        // Create booking object
        const newBooking = {
            id: bookingId,
            ...formData,
            createdAt: new Date().toISOString()
        };

        // Get existing bookings or initialize empty array
        const existingBookings = JSON.parse(localStorage.getItem('glampBookings')) || [];

        // Add new booking
        const updatedBookings = [...existingBookings, newBooking];

        // Save to localStorage
        localStorage.setItem('glampBookings', JSON.stringify(updatedBookings));

        // Redirect to bookings page using window.location instead of navigate
        window.location.href = '/bookings';
    };

    // Expanded list of popular glamping destinations with more details
    const destinations = [
        {
            name: "Yosemite Valley",
            image: "https://www.extranomical.com/wp-content/uploads/2023/03/Valley-View-Overlook.jpg",
            description: "Luxury tents with stunning valley views",
            price: "$299/night",
            features: ["Hot tub", "Panoramic views", "Private deck"]
        },
        {
            name: "Joshua Tree",
            image: "https://npf-prod.imgix.net/uploads/iStock_000046726096XLarge.jpg?auto=compress%2Cformat&fit=max&q=80&w=1600",
            description: "Desert dome houses under starry skies",
            price: "$249/night",
            features: ["Stargazing deck", "Air conditioning", "Fire pit"]
        },
        {
            name: "Olympic Peninsula",
            image: "https://content.vbt.com/content/uploads/2023/11/washington-olympic-peninsula-4-1280x840.jpg",
            description: "Treehouses nestled in ancient forests",
            price: "$329/night",
            features: ["Elevated platforms", "Rain shower", "Forest trails"]
        },
        {
            name: "Maine Coastline",
            image: "https://assets.vogue.com/photos/67094bb5803acd9bae5c5c1c/16:9/w_1280,c_limit/GettyImages-689355842.jpg",
            description: "Seaside yurts with private beaches",
            price: "$279/night",
            features: ["Ocean views", "Private beach access", "Outdoor kitchen"]
        },
        {
            name: "Sedona Red Rocks",
            image: "https://wildlandtrekking.com/content/uploads/2020/03/sedona-ib-slides1.jpg",
            description: "Luxury desert tents with red rock views",
            price: "$319/night",
            features: ["Outdoor shower", "Meditation deck", "Guided hikes"]
        },
        {
            name: "Blue Ridge Mountains",
            image: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Rainy_Blue_Ridge-27527.jpg",
            description: "Mountain cabins with panoramic vistas",
            price: "$259/night",
            features: ["Wood-burning stove", "Mountain views", "Hiking trails"]
        },
        {
            name: "Big Sur Coastline",
            image: "https://travelcuriousoften.com/wp-content/uploads/2021/06/Big-Sur-Hwy-1-6-2-scaled.jpeg",
            description: "Cliffside eco-pods overlooking the Pacific",
            price: "$399/night",
            features: ["Floor-to-ceiling windows", "Private hot tub", "Electric car charging"]
        },
        {
            name: "The Serai,Rajasthan",
            image: "https://thesujanlife.com/documents/35366/45494/RTS.jpg/406169cb-fd4b-30a0-27cc-681088ea6880?t=1572337437548",
            description: "With luxury tents in the middle of the Thar Desert, this resort offers a royal desert experience.",
            price: "$249/night",
            features: ["Stargazing deck", "Air conditioning", "Mountain biking"]
        }
    ];

    // Filter top destinations for the main display
    const topDestinations = destinations.slice(0, 4);

    // Additional destinations for the expanded view
    const additionalDestinations = destinations.slice(4);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <motion.div
                className="hero-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <div className="hero-content">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        Discover Unique Glamping Experiences
                    </motion.h1>
                    <motion.p
                        className="lead"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        Luxury camping in stunning natural locations
                    </motion.p>
                </div>
            </motion.div>
            {/* Search Section */}
            <motion.div
                className="search-section"
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                variants={fadeIn}
            >
                <div className="card search-card shadow">
                    <div className="card-body">
                        <h2 className="card-title mb-4">Find Your Perfect Glamping Spot</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-md-12">
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <MapPin size={18} />
                                        </span>
                                        <select
                                            className="form-select"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select a destination</option>
                                            {destinations.map((dest, index) => (
                                                <option key={index} value={dest.name}>{dest.name}</option>
                                            ))}
                                            <option value="custom">Other (specify location)</option>
                                        </select>
                                    </div>
                                    {formData.location === 'custom' && (
                                        <input
                                            type="text"
                                            className="form-control mt-2"
                                            placeholder="Enter your desired location"
                                            name="customLocation"
                                            value={formData.customLocation || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, customLocation: e.target.value }))}
                                            required={formData.location === 'custom'}
                                        />
                                    )}
                                </div>

                                <div className="col-md-6">
                                    <div className="date-input-container">
                                        <label className="form-label">Check-in</label>
                                        <div className="input-group calendar-input-group">
                                            <span className="input-group-text">
                                                <Calendar size={18} onClick={() => handleCalendarToggle('checkIn')} />
                                            </span>
                                            <input
                                                type="date"
                                                className="form-control date-picker"
                                                name="checkIn"
                                                value={formData.checkIn}
                                                onChange={handleChange}
                                                min={today}
                                                required
                                                onFocus={() => handleCalendarToggle('checkIn')}
                                            />
                                        </div>
                                        {calendarOpen.checkIn && (
                                            <div className="calendar-tooltip">
                                                <div className="calendar-header">
                                                    <span>Select Check-in Date</span>
                                                    <button type="button" className="btn-close" onClick={() => handleCalendarToggle('checkIn')}></button>
                                                </div>
                                                <input
                                                    type="date"
                                                    className="form-control expanded-calendar"
                                                    name="checkIn"
                                                    value={formData.checkIn}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        handleCalendarToggle('checkIn');
                                                    }}
                                                    min={today}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="date-input-container">
                                        <label className="form-label">Check-out</label>
                                        <div className="input-group calendar-input-group">
                                            <span className="input-group-text">
                                                <Calendar size={18} onClick={() => handleCalendarToggle('checkOut')} />
                                            </span>
                                            <input
                                                type="date"
                                                className="form-control date-picker"
                                                name="checkOut"
                                                value={formData.checkOut}
                                                onChange={handleChange}
                                                min={formData.checkIn || tomorrowStr}
                                                required
                                                onFocus={() => handleCalendarToggle('checkOut')}
                                                disabled={!formData.checkIn}
                                            />
                                        </div>
                                        {calendarOpen.checkOut && (
                                            <div className="calendar-tooltip">
                                                <div className="calendar-header">
                                                    <span>Select Check-out Date</span>
                                                    <button type="button" className="btn-close" onClick={() => handleCalendarToggle('checkOut')}></button>
                                                </div>
                                                <input
                                                    type="date"
                                                    className="form-control expanded-calendar"
                                                    name="checkOut"
                                                    value={formData.checkOut}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        handleCalendarToggle('checkOut');
                                                    }}
                                                    min={formData.checkIn || tomorrowStr}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-12">
                                    <label className="form-label">Number of Guests</label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <Users size={18} />
                                        </span>
                                        <select
                                            className="form-select"
                                            name="guests"
                                            value={formData.guests}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="1">1 Guest</option>
                                            <option value="2">2 Guests</option>
                                            <option value="3">3 Guests</option>
                                            <option value="4">4 Guests</option>
                                            <option value="5">5 Guests</option>
                                            <option value="6">6 Guests</option>
                                            <option value="7">7 Guests</option>
                                            <option value="8">8+ Guests</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="col-12 mt-3 d-flex justify-content-center">
                                    <motion.button
                                        type="submit"
                                        className="btn btn-primary w-25 py-3"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <CalendarCheck size={18} className="me-1" />
                                        Book Now
                                    </motion.button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
            {/* Why Choose Glamping? */}
            <motion.div
                className="features-section mt-5"
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                variants={staggerChildren}
            >
                <h2 className="text-center mb-4">Why Choose Glamping?</h2>
                <div className="row">
                    <div className="col-md-4 mb-4">
                        <motion.div
                            className="feature-card shadow-sm"
                            variants={fadeIn}
                            whileHover={{ y: -10, transition: { duration: 0.3 } }}
                        >
                            <div className="feature-icon">🏕️</div>
                            <h3>Unique Stays</h3>
                            <p>From treehouses to yurts, find accommodations as unique as your adventure.</p>
                        </motion.div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <motion.div
                            className="feature-card shadow-sm"
                            variants={fadeIn}
                            whileHover={{ y: -10, transition: { duration: 0.3 } }}
                        >
                            <div className="feature-icon">🌲</div>
                            <h3>Natural Locations</h3>
                            <p>Experience nature without sacrificing comfort or luxury.</p>
                        </motion.div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <motion.div
                            className="feature-card shadow-sm"
                            variants={fadeIn}
                            whileHover={{ y: -10, transition: { duration: 0.3 } }}
                        >
                            <div className="feature-icon">✨</div>
                            <h3>Memorable Experiences</h3>
                            <p>Create memories that will last a lifetime in extraordinary settings.</p>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
            {/* Featured Destinations */}
            <motion.div
                className="popular-destinations mt-5 mb-5"
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                variants={fadeIn}
            >
                <h2 className="text-center mb-4">Featured Destinations</h2>
                <div className="row">
                    {topDestinations.map((destination, index) => (
                        <div className="col-md-6 col-lg-3 mb-4" key={index}>
                            <motion.div
                                className="destination-card shadow"
                                whileHover={{
                                    y: -10,
                                    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                                    transition: { duration: 0.3 }
                                }}
                                variants={fadeIn}
                            >
                                <div className="destination-badge">{destination.price}</div>
                                <img
                                    src={destination.image}
                                    alt={destination.name}
                                    className="destination-image"
                                />
                                <div className="destination-content p-3">
                                    <h4>{destination.name}</h4>
                                    <p>{destination.description}</p>
                                    <div className="destination-features mb-3">
                                        {destination.features.map((feature, i) => (
                                            <span key={i} className="feature-tag">{feature}</span>
                                        ))}
                                    </div>
                                    <motion.button
                                        className="btn btn-sm btn-outline-primary"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            setFormData(prev => ({ ...prev, location: destination.name }));
                                            document.querySelector('select[name="location"]').scrollIntoView({ behavior: 'smooth' });
                                        }}
                                    >
                                        View Availability
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
                <div className="more-destinations mt-5">
                    <h3 className="text-center mb-4">More Breathtaking Locations</h3>
                    <div className="row">
                        {additionalDestinations.map((destination, index) => (
                            <div className="col-md-6 col-lg-3 mb-4" key={index}>
                                <motion.div
                                    className="destination-card shadow"
                                    whileHover={{
                                        y: -10,
                                        boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                                        transition: { duration: 0.3 }
                                    }}
                                    variants={fadeIn}
                                >
                                    <div className="destination-badge">{destination.price}</div>
                                    <img
                                        src={destination.image}
                                        alt={destination.name}
                                        className="destination-image"
                                    />
                                    <div className="destination-content p-3">
                                        <h4>{destination.name}</h4>
                                        <p>{destination.description}</p>
                                        <div className="destination-features mb-3">
                                            {destination.features.map((feature, i) => (
                                                <span key={i} className="feature-tag">{feature}</span>
                                            ))}
                                        </div>
                                        <motion.button
                                            className="btn btn-sm btn-outline-primary"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                setFormData(prev => ({ ...prev, location: destination.name }));
                                                document.querySelector('select[name="location"]').scrollIntoView({ behavior: 'smooth' });
                                            }}
                                        >
                                            View Availability
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default HomePage;