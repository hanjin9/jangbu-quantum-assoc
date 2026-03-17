import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { Calendar, Clock, User, MapPin, Phone, Mail } from 'lucide-react';

interface Practitioner {
  id: number;
  name: string;
  title: string;
  specialty: string;
  experience: number;
  bio: string;
  imageUrl: string;
  email: string;
  phone: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface Appointment {
  id: number;
  practitionerId: number;
  practitionerName: string;
  date: string;
  time: string;
  status: string;
}

const MOCK_PRACTITIONERS: Practitioner[] = [
  {
    id: 1,
    name: '김영수',
    title: '양자요법 전문가',
    specialty: '에너지 치유',
    experience: 15,
    bio: '20년 이상의 경험을 가진 양자요법 전문가로, 많은 환자들의 건강 회복을 도왔습니다.',
    imageUrl: 'https://via.placeholder.com/200?text=Kim+Young+Soo',
    email: 'kim.youngsoo@jangbu.com',
    phone: '+82-10-1234-5678'
  },
  {
    id: 2,
    name: '이미영',
    title: '양자요법 관리사',
    specialty: '신체 에너지 밸런싱',
    experience: 12,
    bio: '체계적인 양자요법 교육을 받은 전문 관리사로, 개인 맞춤형 치료를 제공합니다.',
    imageUrl: 'https://via.placeholder.com/200?text=Lee+Mi+Young',
    email: 'lee.miyoung@jangbu.com',
    phone: '+82-10-2345-6789'
  },
  {
    id: 3,
    name: '박준호',
    title: '양자요법 전문가',
    specialty: '만성질환 관리',
    experience: 18,
    bio: '만성질환 환자들을 위한 특화된 양자요법 프로그램을 운영하고 있습니다.',
    imageUrl: 'https://via.placeholder.com/200?text=Park+Jun+Ho',
    email: 'park.junho@jangbu.com',
    phone: '+82-10-3456-7890'
  },
  {
    id: 4,
    name: '최은희',
    title: '양자요법 관리사',
    specialty: '스트레스 완화',
    experience: 10,
    bio: '현대인의 스트레스 관리와 웰니스 증진을 위한 맞춤형 프로그램을 제공합니다.',
    imageUrl: 'https://via.placeholder.com/200?text=Choi+Eun+Hee',
    email: 'choi.eunhee@jangbu.com',
    phone: '+82-10-4567-8901'
  }
];

const TIME_SLOTS: TimeSlot[] = [
  { time: '09:00', available: true },
  { time: '10:00', available: true },
  { time: '11:00', available: false },
  { time: '14:00', available: true },
  { time: '15:00', available: true },
  { time: '16:00', available: true },
  { time: '17:00', available: false },
  { time: '18:00', available: true },
];

export default function Appointments() {
  const { user, isAuthenticated } = useAuth();
  const [practitioners, setPractitioners] = useState<Practitioner[]>(MOCK_PRACTITIONERS);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedPractitioner, setSelectedPractitioner] = useState<Practitioner | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [consultationType, setConsultationType] = useState<string>('general');
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    // TODO: Fetch user's appointments from API
    const mockAppointments: Appointment[] = [
      {
        id: 1,
        practitionerId: 1,
        practitionerName: '김영수',
        date: '2026-03-25',
        time: '10:00',
        status: 'confirmed'
      }
    ];
    setAppointments(mockAppointments);
  }, [isAuthenticated]);

  const handleBookAppointment = async () => {
    if (!selectedPractitioner || !selectedDate || !selectedTime) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    setIsBooking(true);

    try {
      // TODO: Call API to book appointment
      const newAppointment: Appointment = {
        id: appointments.length + 1,
        practitionerId: selectedPractitioner.id,
        practitionerName: selectedPractitioner.name,
        date: selectedDate,
        time: selectedTime,
        status: 'scheduled'
      };

      setAppointments([...appointments, newAppointment]);
      
      // Reset form
      setSelectedPractitioner(null);
      setSelectedDate('');
      setSelectedTime('');
      setConsultationType('general');

      alert('상담 예약이 완료되었습니다.');
    } catch (error) {
      console.error('Booking error:', error);
      alert('예약 중 오류가 발생했습니다.');
    } finally {
      setIsBooking(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 max-w-md">
          <h1 className="text-2xl font-bold mb-4">로그인 필요</h1>
          <p className="text-muted-foreground mb-6">상담 예약을 위해 로그인해주세요.</p>
          <Button onClick={() => window.location.href = '/'}>홈으로 돌아가기</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">상담 예약</h1>
          <p className="text-muted-foreground">전문 양자요법 관리사와의 개인 상담을 예약하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Practitioners */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">관리사 선택</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {practitioners.map(practitioner => (
                  <Card
                    key={practitioner.id}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedPractitioner?.id === practitioner.id
                        ? 'border-2 border-amber-500 bg-amber-50'
                        : 'border hover:border-amber-300'
                    }`}
                    onClick={() => setSelectedPractitioner(practitioner)}
                  >
                    <div className="flex gap-4">
                      <img
                        src={practitioner.imageUrl}
                        alt={practitioner.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground">{practitioner.name}</h3>
                        <p className="text-sm text-muted-foreground">{practitioner.title}</p>
                        <p className="text-xs text-amber-600 mt-1">경력: {practitioner.experience}년</p>
                        <p className="text-xs text-muted-foreground mt-1">{practitioner.specialty}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Selected Practitioner Details */}
            {selectedPractitioner && (
              <Card className="p-6 border-2 border-amber-500 bg-amber-50">
                <h3 className="text-xl font-bold mb-4">{selectedPractitioner.name} - 상세 정보</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-amber-600 mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">직책</p>
                      <p className="font-semibold">{selectedPractitioner.title}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-amber-600 mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">전문분야</p>
                      <p className="font-semibold">{selectedPractitioner.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-amber-600 mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">이메일</p>
                      <p className="font-semibold">{selectedPractitioner.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-amber-600 mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">전화</p>
                      <p className="font-semibold">{selectedPractitioner.phone}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t">
                    <p className="text-sm text-muted-foreground mb-2">소개</p>
                    <p className="text-foreground">{selectedPractitioner.bio}</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Date and Time Selection */}
            {selectedPractitioner && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">날짜 및 시간 선택</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">상담 날짜</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">상담 시간</label>
                    <div className="grid grid-cols-4 gap-2">
                      {TIME_SLOTS.map(slot => (
                        <button
                          key={slot.time}
                          onClick={() => slot.available && setSelectedTime(slot.time)}
                          disabled={!slot.available}
                          className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                            selectedTime === slot.time
                              ? 'bg-amber-500 text-white'
                              : slot.available
                              ? 'bg-muted text-foreground hover:bg-amber-100'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">상담 유형</label>
                    <select
                      value={consultationType}
                      onChange={(e) => setConsultationType(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-amber-500"
                    >
                      <option value="general">일반 상담</option>
                      <option value="follow-up">추후 상담</option>
                      <option value="emergency">긴급 상담</option>
                    </select>
                  </div>

                  <Button
                    onClick={handleBookAppointment}
                    disabled={isBooking || !selectedDate || !selectedTime}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 font-semibold rounded-lg"
                  >
                    {isBooking ? '예약 중...' : '상담 예약하기'}
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar - Upcoming Appointments */}
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">예약된 상담</h2>
              {appointments.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">예약된 상담이 없습니다.</p>
              ) : (
                <div className="space-y-3">
                  {appointments.map(appointment => (
                    <Card key={appointment.id} className="p-4 bg-muted">
                      <h3 className="font-bold text-foreground mb-2">{appointment.practitionerName}</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{appointment.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="pt-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            appointment.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {appointment.status === 'confirmed' ? '확정' : '예약됨'}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
