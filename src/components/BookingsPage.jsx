import React, { useState, useEffect } from 'react';
import { Edit, Save, X, MapPin, Calendar, CalendarX2, Users, ChevronRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './BookingsPage.scss';
import NoBookings from '../Assets/empty-box.png'

// // Animation variants consistent with HomePage
// const fadeIn = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
// };

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
    },
    exit: {
        opacity: 0,
        x: -100,
        transition: { duration: 0.3 }
    }
};

const BookingsPage = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [editBookingId, setEditBookingId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        location: '',
        checkIn: '',
        checkOut: '',
        guests: 1
    });
    const [loading, setLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Load bookings from localStorage with a slight delay to show loading animation
        setTimeout(() => {
            const storedBookings = JSON.parse(localStorage.getItem('glampBookings')) || [];
            setBookings(storedBookings);
            setLoading(false);
            // Set loaded state after a short delay for animations (consistent with HomePage)
            setTimeout(() => setIsLoaded(true), 100);
        }, 800);
    }, []);

    const handleDelete = (bookingId) => {
        if (deleteConfirm === bookingId) {
            // Confirm delete - actually delete the booking
            const updatedBookings = bookings.filter(booking => booking.id !== bookingId);
            setBookings(updatedBookings);
            localStorage.setItem('glampBookings', JSON.stringify(updatedBookings));
            setDeleteConfirm(null);
        } else {
            // First click - ask for confirmation
            setDeleteConfirm(bookingId);
        }
    };

    const cancelDelete = () => {
        setDeleteConfirm(null);
    };

    const handleEdit = (booking) => {
        setEditBookingId(booking.id);
        setEditFormData({
            location: booking.location,
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            guests: booking.guests
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // If check-in date changes, ensure check-out date is not before it (consistent with HomePage)
        if (name === "checkIn" && value) {
            const checkInDate = new Date(value);
            const nextDay = new Date(checkInDate);
            nextDay.setDate(checkInDate.getDate() + 1);

            if (new Date(editFormData.checkOut) <= checkInDate) {
                setEditFormData(prev => ({
                    ...prev,
                    checkOut: nextDay.toISOString().split('T')[0]
                }));
            }
        }
    };

    const handleCancelEdit = () => {
        setEditBookingId(null);
    };

    const handleSave = (bookingId) => {
        // Update the booking with new data
        const updatedBookings = bookings.map(booking => {
            if (booking.id === bookingId) {
                return {
                    ...booking,
                    ...editFormData,
                    updatedAt: new Date().toISOString()
                };
            }
            return booking;
        });

        // Update state and localStorage
        setBookings(updatedBookings);
        localStorage.setItem('glampBookings', JSON.stringify(updatedBookings));

        // Exit edit mode
        setEditBookingId(null);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Get the location image (in a real app, this would fetch from an API)
    const getLocationImage = (location) => {
        // Sample locations - expanded to match HomePage destinations
        const locationImages = {
            'Yosemite Valley': 'https://www.extranomical.com/wp-content/uploads/2023/03/Valley-View-Overlook.jpg',
            'Joshua Tree': 'https://npf-prod.imgix.net/uploads/iStock_000046726096XLarge.jpg?auto=compress%2Cformat&fit=max&q=80&w=1600',
            'Olympic Peninsula': 'https://content.vbt.com/content/uploads/2023/11/washington-olympic-peninsula-4-1280x840.jpg',
            'Maine Coastline': 'https://assets.vogue.com/photos/67094bb5803acd9bae5c5c1c/16:9/w_1280,c_limit/GettyImages-689355842.jpg',
            'Sedona Red Rocks': 'https://wildlandtrekking.com/content/uploads/2020/03/sedona-ib-slides1.jpg',
            'Blue Ridge Mountains': 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Rainy_Blue_Ridge-27527.jpg',
            'Big Sur Coastline': 'https://travelcuriousoften.com/wp-content/uploads/2021/06/Big-Sur-Hwy-1-6-2-scaled.jpeg',
            'The Serai,Rajasthan': 'https://thesujanlife.com/documents/35366/45494/RTS.jpg/406169cb-fd4b-30a0-27cc-681088ea6880?t=1572337437548'
        };

        return locationImages[location] || 'https://i0.wp.com/buoyantlifestyles.com/wp-content/uploads/2021/09/IMG_6359-1-scaled.jpg?ssl=1';
    };

    // Calculate duration of stay
    const calculateDuration = (checkIn, checkOut) => {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Get location features (matching the HomePage structure)
    const getLocationFeatures = (location) => {
        const locationFeatures = {
            'Yosemite Valley': ["Hot tub", "Panoramic views", "Private deck"],
            'Joshua Tree': ["Stargazing deck", "Air conditioning", "Fire pit"],
            'Olympic Peninsula': ["Elevated platforms", "Rain shower", "Forest trails"],
            'Maine Coastline': ["Ocean views", "Private beach access", "Outdoor kitchen"],
            'Sedona Red Rocks': ["Outdoor shower", "Meditation deck", "Guided hikes"],
            'Blue Ridge Mountains': ["Wood-burning stove", "Mountain views", "Hiking trails"],
            'Big Sur Coastline': ["Floor-to-ceiling windows", "Private hot tub", "Electric car charging"],
            'The Serai,Rajasthan': ["Stargazing deck", "Air conditioning", "Mountain biking"]
        };

        return locationFeatures[location] || ["Luxury amenities", "Natural surroundings", "Unique experience"];
    };

    // Get location descriptions (matching the HomePage)
    const getLocationDescription = (location) => {
        const descriptions = {
            'Yosemite Valley': "Luxury tents with stunning valley views",
            'Joshua Tree': "Desert dome houses under starry skies",
            'Olympic Peninsula': "Treehouses nestled in ancient forests",
            'Maine Coastline': "Seaside yurts with private beaches",
            'Sedona Red Rocks': "Luxury desert tents with red rock views",
            'Blue Ridge Mountains': "Mountain cabins with panoramic vistas",
            'Big Sur Coastline': "Cliffside eco-pods overlooking the Pacific",
            'Moab Desert': "With luxury tents in the middle of the Thar Desert, this resort offers a royal desert experience."
        };

        return descriptions[location] || "A unique glamping experience in nature";
    };

    return (
        <div className="bookings-page">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bookings-header text-center mb-5"
            >
                <h1 className="display-5">My Glamping Adventures</h1>
                <p className="text-muted">Manage your upcoming glamping experiences</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-4"
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                <motion.button
                    onClick={() => navigate('/')}
                    className="btn btn-outline-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ArrowLeft size={16} className="me-2" /> Back to Home
                </motion.button>
            </motion.div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading your adventures...</p>
                </div>
            ) : bookings.length === 0 ? (
                <motion.div
                    className="empty-state text-center py-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    <div className="empty-state-icon mb-4">
                        <img
                            src={NoBookings}
                            alt="No bookings"
                            className="img-fluid rounded-circle"
                        />
                    </div>

                    <h2>No Bookings Yet</h2>
                    <p className="text-muted mb-4">You haven't made any glamping bookings yet.</p>
                    <motion.a
                        href="/"
                        className="btn btn-primary"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Book Your First Adventure <ChevronRight size={16} />
                    </motion.a>
                </motion.div>
            ) : (
                <motion.div
                    className="row"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isLoaded ? "visible" : "hidden"}
                >
                    <AnimatePresence>
                        {bookings.map(booking => (
                            <motion.div
                                className="col-md-6 col-lg-4 mb-4"
                                key={booking.id}
                                variants={itemVariants}
                                layout
                                exit="exit"
                            >
                                <motion.div
                                    className="booking-card card shadow-sm h-100"
                                    whileHover={{
                                        y: -10,
                                        boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                                        transition: { duration: 0.3 }
                                    }}
                                >
                                    {!editBookingId && (
                                        <div className="location-image-container">
                                            <img
                                                src={getLocationImage(booking.location)}
                                                className="card-img-top location-image"
                                                alt={booking.location}
                                            />
                                            <div className="location-badge">
                                                <MapPin size={14} className="icon" /> {booking.location}
                                            </div>
                                            <div className="price-badge">
                                                ${Math.floor(Math.random() * 100) + 200}/night
                                            </div>
                                        </div>
                                    )}

                                    <div className="card-body">
                                        {editBookingId === booking.id ? (
                                            // Edit Form
                                            <motion.div
                                                className="edit-form"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <h5 className="card-title mb-3">Edit Booking</h5>

                                                <div className="mb-3">
                                                    <label className="form-label">Location</label>
                                                    <div className="input-group">
                                                        <span className="input-group-text">
                                                            <MapPin size={16} />
                                                        </span>
                                                        <select
                                                            className="form-select"
                                                            name="location"
                                                            value={editFormData.location}
                                                            onChange={handleEditChange}
                                                            required
                                                        >
                                                            <option value="">Select a destination</option>
                                                            <option value="Yosemite Valley">Yosemite Valley</option>
                                                            <option value="Joshua Tree">Joshua Tree</option>
                                                            <option value="Olympic Peninsula">Olympic Peninsula</option>
                                                            <option value="Maine Coastline">Maine Coastline</option>
                                                            <option value="Sedona Red Rocks">Sedona Red Rocks</option>
                                                            <option value="Blue Ridge Mountains">Blue Ridge Mountains</option>
                                                            <option value="Big Sur Coastline">Big Sur Coastline</option>
                                                            <option value="Moab Desert">The Serai,Rajasthan</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <label className="form-label">Check-in</label>
                                                    <div className="input-group">
                                                        <span className="input-group-text">
                                                            <Calendar size={16} />
                                                        </span>
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            name="checkIn"
                                                            value={editFormData.checkIn}
                                                            onChange={handleEditChange}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <label className="form-label">Check-out</label>
                                                    <div className="input-group">
                                                        <span className="input-group-text">
                                                            <Calendar size={16} />
                                                        </span>
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            name="checkOut"
                                                            value={editFormData.checkOut}
                                                            onChange={handleEditChange}
                                                            required
                                                            min={editFormData.checkIn}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <label className="form-label">Guests</label>
                                                    <div className="input-group">
                                                        <span className="input-group-text">
                                                            <Users size={16} />
                                                        </span>
                                                        <select
                                                            className="form-select"
                                                            name="guests"
                                                            value={editFormData.guests}
                                                            onChange={handleEditChange}
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

                                                <div className="d-flex gap-2 justify-content-end mt-4">
                                                    <motion.button
                                                        className="btn btn-outline-danger"
                                                        onClick={handleCancelEdit}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <X />Decline
                                                    </motion.button>
                                                    <motion.button
                                                        className="btn btn-primary"
                                                        onClick={() => handleSave(booking.id)}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <Save size={16} /> Save & Continue
                                                    </motion.button>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            // Display Booking
                                            <>
                                                <div className="location-description mb-3">
                                                    {getLocationDescription(booking.location)}
                                                </div>

                                                <div className="booking-info">
                                                    <div className="booking-dates mb-3">
                                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                                            <div>
                                                                <small className="text-muted d-block">Check-in</small>
                                                                <strong>{formatDate(booking.checkIn)}</strong>
                                                            </div>
                                                            <div className="duration-badge">
                                                                {calculateDuration(booking.checkIn, booking.checkOut)} nights
                                                            </div>
                                                            <div className="text-end">
                                                                <small className="text-muted d-block">Check-out</small>
                                                                <strong>{formatDate(booking.checkOut)}</strong>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="guests-info mb-3">
                                                        <div className="d-flex align-items-center">
                                                            <Users size={16} className="me-2 text-muted" />
                                                            <span>
                                                                {booking.guests} {parseInt(booking.guests) === 1 ? 'Guest' : 'Guests'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="destination-features mb-3">
                                                        {getLocationFeatures(booking.location).map((feature, i) => (
                                                            <span key={i} className="feature-tag">{feature}</span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="booking-actions d-flex justify-content-between mt-4">
                                                    <motion.button
                                                        className="btn btn-outline-primary"
                                                        onClick={() => handleEdit(booking)}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <Edit size={16} /> Modify
                                                    </motion.button>

                                                    {deleteConfirm === booking.id ? (
                                                        <div className="d-flex gap-2">
                                                            <motion.button
                                                                className="btn btn-sm btn-outline-secondary"
                                                                onClick={cancelDelete}
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                            >
                                                                Decline
                                                            </motion.button>
                                                            <motion.button
                                                                className="btn btn-sm btn-danger"
                                                                onClick={() => handleDelete(booking.id)}
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                            >
                                                                Accept
                                                            </motion.button>
                                                        </div>
                                                    ) : (
                                                        <motion.button
                                                            className="btn btn-outline-danger"
                                                            onClick={() => handleDelete(booking.id)}
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <CalendarX2 />Decline
                                                        </motion.button>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
};

export default BookingsPage;