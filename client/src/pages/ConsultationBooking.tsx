"use client";

import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Mic, MicOff, Upload, X, Play, Pause } from "lucide-react";
import { useState, useRef } from "react";

export default function ConsultationBooking() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    consultationContent: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  
  // 음성 녹음 관련 상태
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // 파일 업로드 관련 상태
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 음성 녹음 시작
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(audioBlob);
        
        // 음성 인식 (Whisper API 호출)
        await transcribeAudio(audioBlob);
        
        // 스트림 종료
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // 녹음 시간 타이머
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      setError("마이크 접근 권한이 필요합니다.");
      console.error("마이크 접근 오류:", err);
    }
  };

  // 음성 녹음 중지
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  };

  // 음성 인식 (Whisper API 호출)
  const transcribeAudio = async (blob: Blob) => {
    try {
      const formDataForTranscribe = new FormData();
      formDataForTranscribe.append("file", blob, "audio.webm");
      
      const response = await fetch("/api/trpc/transcribe.transcribeAudio", {
        method: "POST",
        body: formDataForTranscribe,
      });
      
      const result = await response.json();
      if (result.result?.data?.text) {
        setFormData(prev => ({
          ...prev,
          consultationContent: (prev.consultationContent + " " + result.result.data.text).trim()
        }));
      }
    } catch (err) {
      console.error("음성 인식 오류:", err);
    }
  };

  // 파일 업로드
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (uploadedFiles.length + files.length > 5) {
      setError("최대 5개의 파일만 업로드 가능합니다.");
      return;
    }
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  // 파일 제거
  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  // 폼 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }

    if (!formData.phone.trim()) {
      setError("휴대폰 번호를 입력해주세요.");
      return;
    }

    // 휴대폰 번호 형식 검사 (010-XXXX-XXXX)
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("휴대폰 번호 형식이 올바르지 않습니다. (010-XXXX-XXXX)");
      return;
    }

    // 상담 예약 데이터 저장
    console.log("상담 예약 데이터:", {
      ...formData,
      files: uploadedFiles,
      audioBlob: audioBlob ? "있음" : "없음"
    });

    // 성공 메시지
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", phone: "", consultationContent: "" });
      setUploadedFiles([]);
      setAudioBlob(null);
      navigate("/");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">상담 예약</h1>
          <p className="text-gray-400 text-lg">
            양자요법 관리사와의 상담을 예약하세요
          </p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg p-8 border border-yellow-400/20">
          {/* 에러 메시지 */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
              {error}
            </div>
          )}

          {/* 성공 메시지 */}
          {submitted && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-300">
              상담 예약이 완료되었습니다. 곧 연락드리겠습니다.
            </div>
          )}

          <div className="space-y-6">
            {/* 이름 */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                이름 *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="홍길동"
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-yellow-400/20 focus:outline-none focus:border-yellow-400 placeholder-gray-500 text-lg"
              />
            </div>

            {/* 휴대폰 번호 */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                휴대폰 번호 *
              </label>
              <div className="flex gap-2 items-center">
                <div className="bg-slate-700 text-white px-4 py-3 rounded-lg border border-yellow-400/20 font-semibold text-lg min-w-fit whitespace-nowrap">
                  010 -
                </div>
                <input
                  type="tel"
                  required
                  maxLength={8}
                  value={formData.phone.replace(/^010-/, '').replace(/-/g, '')}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
                    let formatted = digits;
                    if (digits.length > 4) {
                      formatted = digits.slice(0, 4) + '-' + digits.slice(4);
                    }
                    setFormData({ ...formData, phone: '010-' + formatted });
                  }}
                  placeholder="0000-0000"
                  className="flex-1 bg-slate-700 text-white px-4 py-3 rounded-lg border border-yellow-400/20 focus:outline-none focus:border-yellow-400 placeholder-gray-500 text-lg"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                형식: 010-XXXX-XXXX (숫자 8자리만 입력)
              </p>
            </div>

            {/* 상담 내용 */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                상담 내용
              </label>
              <textarea
                value={formData.consultationContent}
                onChange={(e) =>
                  setFormData({ ...formData, consultationContent: e.target.value })
                }
                placeholder="상담 내용을 입력하거나 마이크 버튼으로 음성 녹음해주세요"
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-yellow-400/20 focus:outline-none focus:border-yellow-400 placeholder-gray-500 text-lg h-32 resize-none"
              />
            </div>

            {/* 음성 녹음 */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                음성 녹음 (선택사항)
              </label>
              <div className="flex gap-2 mb-4">
                {!isRecording ? (
                  <Button
                    type="button"
                    onClick={startRecording}
                    className="flex-1 bg-yellow-400 text-slate-900 hover:bg-yellow-500 font-bold flex items-center justify-center gap-2"
                  >
                    <Mic className="w-5 h-5" />
                    녹음 시작
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={stopRecording}
                    className="flex-1 bg-red-500 text-white hover:bg-red-600 font-bold flex items-center justify-center gap-2"
                  >
                    <MicOff className="w-5 h-5" />
                    녹음 중지 ({recordingTime}초)
                  </Button>
                )}
              </div>

              {/* 녹음된 음성 재생 */}
              {audioBlob && (
                <div className="flex gap-2 items-center bg-slate-700 p-3 rounded-lg">
                  <Button
                    type="button"
                    onClick={() => {
                      if (isPlayingAudio && audioRef.current) {
                        audioRef.current.pause();
                        setIsPlayingAudio(false);
                      } else if (audioRef.current) {
                        audioRef.current.play();
                        setIsPlayingAudio(true);
                      }
                    }}
                    className="bg-yellow-400 text-slate-900 hover:bg-yellow-500 p-2"
                  >
                    {isPlayingAudio ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </Button>
                  <audio
                    ref={audioRef}
                    src={URL.createObjectURL(audioBlob)}
                    onEnded={() => setIsPlayingAudio(false)}
                  />
                  <span className="text-gray-300 text-sm">녹음된 음성</span>
                </div>
              )}
            </div>

            {/* 파일 업로드 */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                파일 업로드 (선택사항, 최대 5개)
              </label>
              <div className="flex gap-2 mb-4">
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 bg-slate-700 text-white hover:bg-slate-600 border border-yellow-400/20 font-bold flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  파일 선택
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* 업로드된 파일 목록 */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-slate-700 p-3 rounded-lg"
                    >
                      <span className="text-gray-300 text-sm truncate">
                        {file.name}
                      </span>
                      <Button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="bg-red-500 text-white hover:bg-red-600 p-1"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 제출 버튼 */}
            <Button
              type="submit"
              className="w-full bg-yellow-400 text-slate-900 hover:bg-yellow-500 font-bold text-lg py-4"
            >
              상담 예약 신청
            </Button>
          </div>
        </form>

        {/* 안내 문구 */}
        <div className="mt-8 text-center text-gray-400">
          <p>담당자가 입력하신 휴대폰 번호로 연락드립니다.</p>
        </div>
      </div>
    </div>
  );
}
