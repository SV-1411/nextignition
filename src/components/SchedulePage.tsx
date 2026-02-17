import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  Plus,
  X,
  Check,
  Users,
  Video,
  MapPin,
  AlertCircle,
  Save,
} from 'lucide-react';
import { brandColors } from '../utils/colors';
import api from '../services/api';

interface AvailabilitySlot {
  startTime: string;
  endTime: string;
}

interface AvailabilityDay {
  dayOfWeek: number;
  slots: AvailabilitySlot[];
}

interface Booking {
  _id: string;
  founder: {
    name: string;
    avatar?: string;
  };
  date: string;
  startTime: string;
  duration: number;
  topic: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  meetingLink?: string;
}

export function SchedulePage() {
  const [availability, setAvailability] = useState<AvailabilityDay[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [newSlot, setNewSlot] = useState({ startTime: '09:00', endTime: '10:00' });
  const [saving, setSaving] = useState(false);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    fetchAvailability();
    fetchBookings();
  }, []);

  const fetchAvailability = async () => {
    try {
      const response = await api.get('/availability/my-availability');
      setAvailability(response.data);
    } catch (error) {
      console.error('Failed to fetch availability', error);
      setAvailability([]);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/booking');
      const expertBookings = response.data.filter((booking: any) => booking.status === 'confirmed');
      setBookings(expertBookings);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const addTimeSlot = async () => {
    setSaving(true);
    try {
      const currentDay = availability.find(d => d.dayOfWeek === selectedDay);
      const updatedSlots = [...(currentDay?.slots || []), newSlot];

      await api.post('/availability/availability', {
        dayOfWeek: selectedDay,
        slots: updatedSlots,
      });

      await fetchAvailability();
      setNewSlot({ startTime: '09:00', endTime: '10:00' });
    } catch (error) {
      console.error('Failed to add time slot', error);
    } finally {
      setSaving(false);
    }
  };

  const removeTimeSlot = async (slotIndex: number) => {
    try {
      const currentDay = availability.find(d => d.dayOfWeek === selectedDay);
      if (!currentDay) return;

      const updatedSlots = currentDay.slots.filter((_, index) => index !== slotIndex);

      if (updatedSlots.length === 0) {
        // Delete the entire day
        await api.delete(`/availability/availability/${selectedDay}`);
      } else {
        await api.post('/availability/availability', {
          dayOfWeek: selectedDay,
          slots: updatedSlots,
        });
      }

      await fetchAvailability();
    } catch (error) {
      console.error('Failed to remove time slot', error);
    }
  };

  const getCurrentDaySlots = () => {
    return availability.find(d => d.dayOfWeek === selectedDay)?.slots || [];
  };

  const upcomingBookings = bookings
    .filter(booking => new Date(booking.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule Management</h1>
          <p className="text-gray-600 mt-1">Set your availability and manage upcoming sessions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Availability Settings */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Set Your Availability
            </h2>

            {/* Day Selector */}
            <div className="flex flex-wrap gap-2 mb-6">
              {dayNames.map((day, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDay(index)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedDay === index
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Current Day Availability */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3">
                {dayNames[selectedDay]} Availability
              </h3>

              <div className="space-y-3">
                {getCurrentDaySlots().map((slot, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">
                        {slot.startTime} - {slot.endTime}
                      </span>
                    </div>
                    <button
                      onClick={() => removeTimeSlot(index)}
                      className="p-1 hover:bg-red-100 rounded"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}

                {getCurrentDaySlots().length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No availability set for {dayNames[selectedDay]}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Add New Slot */}
            <div className="border-t pt-6">
              <h4 className="font-bold mb-4">Add Time Slot</h4>
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newSlot.startTime}
                    onChange={(e) => setNewSlot(prev => ({ ...prev, startTime: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">End Time</label>
                  <input
                    type="time"
                    value={newSlot.endTime}
                    onChange={(e) => setNewSlot(prev => ({ ...prev, endTime: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={addTimeSlot}
                  disabled={saving}
                  className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {saving ? 'Adding...' : 'Add Slot'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Upcoming Sessions */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Video className="w-5 h-5 text-green-600" />
              Upcoming Sessions
            </h2>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : upcomingBookings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No upcoming sessions</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div key={booking._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {booking.founder.avatar || booking.founder.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm truncate">{booking.founder.name}</h4>
                        <p className="text-xs text-gray-600 mb-2">{booking.topic}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(booking.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {booking.startTime} ({booking.duration}min)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-1">
                        <Video className="w-3 h-3" />
                        Join Call
                      </button>
                      <button className="px-3 py-2 border border-gray-300 text-xs rounded-lg hover:bg-gray-50 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h3 className="font-bold mb-4">This Week</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Sessions</span>
                <span className="font-bold">{bookings.filter(b => b.status === 'confirmed').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Available Hours</span>
                <span className="font-bold">{availability.reduce((total, day) => total + day.slots.length, 0)} hours</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg. Session Rate</span>
                <span className="font-bold">₹500/hr</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}