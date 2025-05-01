
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn, useSession } from "next-auth/react";

const getNext7Days = () => {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return {
      date: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' })
    };
  });
};

export default function BookingPage() {
  const [services, setServices] = useState([
    { id: 1, name: "Ganzkörpermassage", price: 50, duration: 60, description: "Tiefenentspannung für den ganzen Körper", image: "/massage.jpg" },
    { id: 2, name: "Gesichtspflege", price: 30, duration: 45, description: "Intensive Hautpflege für das Gesicht", image: "/facial.jpg" }
  ]);

  const [staffMembers] = useState([
    { id: 1, name: "Anna", avatar: "/anna.jpg", freeTimes: ["09:00", "11:00", "14:00"] },
    { id: 2, name: "Lina", avatar: "/lina.jpg", freeTimes: ["10:00", "13:00", "15:30"] },
    { id: 3, name: "Tom", avatar: "/tom.jpg", freeTimes: ["08:30", "12:00", "16:00"] }
  ]);

  const [selectedService, setSelectedService] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '', date: '', time: '' });
  const dates = getNext7Days();
  const sessionData = useSession() || {};
  const { data: session } = sessionData;

  useEffect(() => {
    if (selectedStaff) {
      const staff = staffMembers.find(s => s.name === selectedStaff);
      setAvailableTimes(staff?.freeTimes || []);
    } else {
      setAvailableTimes([]);
    }
  }, [selectedStaff]);

  const handleBooking = async () => {
    if (!session) {
      alert("Bitte melden Sie sich mit Google an, um einen Termin zu buchen.");
      signIn("google");
      return;
    }

    alert(`Termin erfolgreich gebucht für ${form.name} – Dienstleistung: ${selectedService?.name} bei ${selectedStaff} am ${form.date} um ${form.time}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">1. Dienstleistung wählen</h1>
        {services.map(service => (
          <Card
            key={service.id}
            onClick={() => setSelectedService(service)}
            className={`flex gap-4 items-center p-4 rounded-2xl shadow-md cursor-pointer border ${selectedService?.id === service.id ? 'border-blue-600' : 'border-gray-200 hover:border-blue-400'}`}
          >
            <img src={service.image} alt={service.name} className="w-20 h-20 rounded-xl object-cover" />
            <CardContent className="p-0">
              <h2 className="text-lg font-semibold text-gray-800">{service.name}</h2>
              <p className="text-sm text-gray-600">{service.description}</p>
              <p className="text-sm text-gray-500">{service.price}€ – {service.duration} Minuten</p>
            </CardContent>
          </Card>
        ))}

        {selectedService && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">2. Mitarbeiter wählen</h2>
            <div className="grid grid-cols-2 gap-4">
              {staffMembers.map(staff => (
                <Card
                  key={staff.id}
                  onClick={() => setSelectedStaff(staff.name)}
                  className={`flex items-center gap-4 p-4 rounded-2xl shadow cursor-pointer border ${selectedStaff === staff.name ? 'border-blue-600' : 'border-gray-200 hover:border-blue-400'}`}
                >
                  <img src={staff.avatar} alt={staff.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-medium text-gray-800">{staff.name}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedService && selectedStaff && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">3. Termin buchen</h2>
          <Input placeholder="Ihr Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="rounded-xl" />
          <Input placeholder="Telefonnummer" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="rounded-xl" />

          <div>
            <p className="mb-2 text-sm text-gray-700">Datum wählen:</p>
            <div className="flex overflow-x-auto gap-3 pb-2">
              {dates.map(({ date, label }) => (
                <Button
                  key={date}
                  variant={form.date === date ? 'default' : 'outline'}
                  onClick={() => setForm({ ...form, date })}
                  className="rounded-xl min-w-[100px]"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm text-gray-700">Verfügbare Uhrzeiten:</p>
            <div className="grid grid-cols-3 gap-3">
              {availableTimes.map((time, index) => (
                <Button
                  key={index}
                  variant={form.time === time ? 'default' : 'outline'}
                  onClick={() => setForm({ ...form, time })}
                  className="rounded-xl"
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>

          <Button onClick={handleBooking} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 text-lg">
            Termin bestätigen
          </Button>
        </div>
      )}
    </div>
  );
}
