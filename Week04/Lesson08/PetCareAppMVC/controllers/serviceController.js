const petModel = require('../models/petModel');
const serviceModel = require('../models/serviceModel');
const serviceBookingModel = require('../models/serviceBookingModel');

const bookingSuccessMessage =
  'Booking created. Payment is pending; no payment has been processed.';
const invalidBookingMessage = 'Choose a pet, service, and valid booking date.';
const unavailableMessage = 'That pet or service is unavailable for booking.';
const bookingFailureMessage = 'Unable to create the booking. Please try again.';

function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isPositiveIntegerId(value) {
  return typeof value === 'string' && /^\d+$/.test(value) &&
    Number.isSafeInteger(Number(value)) && Number(value) > 0;
}

function isValidBookingDate(value, today) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);

  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day &&
    value >= today;
}

function listServices(req, res) {
  const ownerId = req.session.user.id;

  petModel.getPetsByOwner(ownerId, (petError, pets) => {
    if (petError) {
      console.error('Error loading pets for service booking:', petError);
      return res.status(500).send('Unable to load pets.');
    }

    serviceModel.getActiveServices((serviceError, services) => {
      if (serviceError) {
        console.error('Error loading services:', serviceError);
        return res.status(500).send('Unable to load services.');
      }

      const requestedPetId = String(req.query.petId || '');
      const selectedPet = pets.find((pet) => String(pet.id) === requestedPetId);
      return res.render('services', {
        pets,
        services,
        selectedPetId: selectedPet ? String(selectedPet.id) : '',
        today: getLocalDateString(),
        messages: req.flash('success'),
        errors: req.flash('error'),
        session: req.session
      });
    });
  });
}

function createBooking(req, res) {
  const { petId, serviceId, bookingDate } = req.body;
  const today = getLocalDateString();

  if (!isPositiveIntegerId(petId) ||
      !isPositiveIntegerId(serviceId) ||
      !isValidBookingDate(bookingDate, today)) {
    req.flash('error', invalidBookingMessage);
    return res.redirect('/services');
  }

  serviceBookingModel.createPendingBooking(
    req.session.user.id,
    Number(petId),
    Number(serviceId),
    bookingDate,
    (error, booking) => {
      if (error) {
        console.error('Error creating service booking:', error);
        req.flash('error', bookingFailureMessage);
        return res.redirect(`/services?petId=${encodeURIComponent(petId)}`);
      }
      if (!booking) {
        req.flash('error', unavailableMessage);
        return res.redirect('/services');
      }

      req.flash('success', bookingSuccessMessage);
      return res.redirect('/bookings');
    }
  );
}

function listBookings(req, res) {
  serviceBookingModel.getBookingsByOwner(req.session.user.id, (error, bookings) => {
    if (error) {
      console.error('Error loading booking history:', error);
      return res.status(500).send('Unable to load booking history.');
    }

    return res.render('bookings', {
      bookings,
      messages: req.flash('success'),
      errors: req.flash('error'),
      session: req.session
    });
  });
}

module.exports = { listServices, createBooking, listBookings };
