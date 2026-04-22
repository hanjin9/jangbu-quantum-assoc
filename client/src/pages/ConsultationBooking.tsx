import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Mic, MicOff, Upload, X, Play, Pause } from "lucide-react";

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
      formDataForTranscribe.append("audio", blob, "recording.webm");
      
      // 서버의 음성 인식 엔드포인트 호출
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formDataForTranscribe,
      });
      
      if (response.ok) {
        const data = await response.json();
        // 기존 내용에 추가
        setFormData(prev => ({
          ...prev,
          consultationContent: prev.consultationContent 
            ? `${prev.consultationContent}\n${data.text}`
            : data.text
        }));
      }
    } catch (err) {
      console.error("음성 인식 오류:", err);
      setError("음성 인식에 실패했습니다.");
    }
  };

  // 파일 업로드 처리
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) {
      const newFiles = Array.from(files);
      // 최대 5개 파일까지만 허용
      if (uploadedFiles.length + newFiles.length > 5) {
        setError("최대 5개 파일까지만 업로드할 수 있습니다.");
        return;
      }
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  // 파일 제거
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 녹음 시간 포맷팅
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 유효성 검사
    if (!formData.name.trim()) {
      setError("성명을 입력해주세요.");
      return;
    }

    if (!formData.phone.trim()) {
      setError("휴대폰 번호를 입력해주세요.");
      return;
    }

    // 휴대폰 번호 형식 검사 (010-0000-0000)
    const phoneRegex = /^01[0-9]-\d{3,4}-\d{4}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("휴대폰 번호 형식이 올바르지 않습니다. (예: 010-0000-0000)");
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
    <div className="min-h-screen bg-slate-900 text-white pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-4">
            상담 예약
          </h1>
          <p className="text-gray-300">
            양자요법 전문가와 1:1 상담을 예약하세요.
          </p>
        </div>

        {/* 예약 폼 */}
        <div className="bg-slate-800 p-8 rounded-lg border border-yellow-400/20">
          {submitted && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg">
              <p className="text-green-300 font-semibold text-center">
                ✓ 상담 예약이 신청되었습니다!
              </p>
              <p className="text-green-300 text-sm text-center">
                담당자가 곧 연락드리겠습니다.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 성명 */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                성명 *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="이름을 입력하세요"
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-yellow-400/20 focus:outline-none focus:border-yellow-400 placeholder-gray-500 text-lg"
              />
            </div>

            {/* 휴대폰 번호 */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                휴대폰 번호 *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="010-0000-0000"
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-yellow-400/20 focus:outline-none focus:border-yellow-400 placeholder-gray-500 text-lg"
              />
              <p className="text-xs text-gray-400 mt-2">
                형식: 010-0000-0000
              </p>
            </div>

            {/* 상담 내용 */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                상담 내용
              </label>
              
              {/* 텍스트 입력 */}
              <textarea
                value={formData.consultationContent}
                onChange={(e) =>
                  setFormData({ ...formData, consultationContent: e.target.value })
                }
                placeholder="상담 내용을 입력하세요. 텍스트 입력 또는 마이크 버튼으로 음성 녹음 가능합니다."
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-yellow-400/20 focus:outline-none focus:border-yellow-400 placeholder-gray-500 text-sm h-32 resize-none"
              />

              {/* 음성 녹음 섹션 */}
              <div className="mt-4 p-4 bg-slate-700/50 rounded-lg border border-yellow-400/10">
                <div className="flex items-center gap-3 mb-3">
                  {isRecording ? (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
                    >
                      <MicOff className="w-5 h-5" />
                      녹음 중지 ({formatTime(recordingTime)})
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-semibold"
                    >
                      <Mic className="w-5 h-5" />
                      음성 녹음 시작
                    </button>
                  )}
                </div>

                {/* 녹음된 오디오 재생 */}
                {audioBlob && (
                  <div className="mt-3 p-3 bg-slate-600 rounded-lg">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (audioRef.current) {
                            if (isPlayingAudio) {
                              audioRef.current.pause();
                            } else {
                              audioRef.current.play();
                            }
                            setIsPlayingAudio(!isPlayingAudio);
                          }
                        }}
                        className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-2 rounded-lg text-sm font-semibold"
                      >
                        {isPlayingAudio ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                        {isPlayingAudio ? "일시정지" : "재생"}
                      </button>
                      <span className="text-sm text-gray-300">녹음된 음성</span>
                    </div>
                    <audio
                      ref={audioRef}
                      src={URL.createObjectURL(audioBlob)}
                      onEnded={() => setIsPlayingAudio(false)}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 파일 업로드 */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                첨부 파일 (선택사항)
              </label>
              <p className="text-xs text-gray-400 mb-3">
                사진, 영상 등 최대 5개 파일 업로드 가능 (각 파일 최대 50MB)
              </p>

              {/* 파일 업로드 버튼 */}
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg border border-yellow-400/20 w-full justify-center font-semibold transition"
                >
                  <Upload className="w-5 h-5" />
                  파일 선택 ({uploadedFiles.length}/5)
                </button>
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
                      className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg border border-yellow-400/10"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-yellow-400">📎</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{file.name}</p>
                          <p className="text-xs text-gray-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="ml-2 p-1 hover:bg-red-500/20 rounded transition"
                      >
                        <X className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 버튼 */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-lg text-lg"
              >
                예약하기
              </Button>
              <Button
                type="button"
                onClick={() => navigate("/")}
                className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 rounded-lg text-lg"
              >
                취소
              </Button>
            </div>
          </form>
        </div>

        {/* 안내 텍스트 */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>상담 시간: 평일 09:00 ~ 18:00</p>
          <p>담당자가 입력하신 휴대폰 번호로 연락드립니다.</p>
        </div>
      </div>
    </div>
  );
}
