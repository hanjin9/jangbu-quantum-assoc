import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";

interface SuccessStory {
  id: number;
  name: string;
  title: string;
  category: string;
  image: string;
  videoUrl: string;
  description: string;
  results: string[];
  duration: string;
}

const successStories: SuccessStory[] = [
  {
    id: 1,
    name: "김영희",
    title: "만성 피로 극복 사례",
    category: "건강",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description:
      "10년간 앓던 만성 피로를 양자요법으로 3개월 만에 극복했습니다. 에너지 수준이 정상화되고 일상 생활이 훨씬 편해졌습니다.",
    results: ["에너지 회복 90%", "수면 개선", "업무 효율 증가"],
    duration: "3개월",
  },
  {
    id: 2,
    name: "박준호",
    title: "스트레스 관리 성공",
    category: "정신건강",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description:
      "직장 스트레스로 인한 불안감을 양자요법으로 해소했습니다. 마음이 편해지고 긍정적인 에너지를 느낍니다.",
    results: ["스트레스 80% 감소", "불안감 해소", "정서 안정"],
    duration: "2개월",
  },
  {
    id: 3,
    name: "이수진",
    title: "면역력 강화 사례",
    category: "면역력",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description:
      "자주 감기에 걸리던 체질이 양자요법으로 개선되었습니다. 면역력이 강해져 건강한 생활을 하고 있습니다.",
    results: ["감기 빈도 70% 감소", "면역력 증강", "체력 개선"],
    duration: "4개월",
  },
  {
    id: 4,
    name: "최민준",
    title: "통증 완화 성공",
    category: "통증관리",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description:
      "오래된 요통과 어깨 통증이 양자요법으로 크게 완화되었습니다. 이제 일상 활동이 훨씬 편합니다.",
    results: ["통증 85% 감소", "움직임 개선", "삶의 질 향상"],
    duration: "3개월",
  },
  {
    id: 5,
    name: "정현지",
    title: "피부 건강 개선",
    category: "미용건강",
    image: "https://images.unsplash.com/photo-1517841905240-1c28a8a0ceb8?w=500&h=500&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description:
      "양자요법으로 피부의 에너지 균형을 맞춘 후 피부 상태가 눈에 띄게 개선되었습니다.",
    results: ["피부 톤 개선", "트러블 감소", "피부 탄력 증가"],
    duration: "2개월",
  },
  {
    id: 6,
    name: "홍석준",
    title: "에너지 레벨 상승",
    category: "건강",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=500&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description:
      "양자요법 후 전체적인 에너지 수준이 올라갔습니다. 활동적이고 긍정적인 삶을 살고 있습니다.",
    results: ["활력 증진", "긍정 에너지 증가", "삶의 만족도 향상"],
    duration: "3개월",
  },
];

export default function SuccessGallery() {
  const { t } = useTranslation();
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    "all",
    "건강",
    "정신건강",
    "면역력",
    "통증관리",
    "미용건강",
  ];

  const filteredStories =
    selectedCategory === "all"
      ? successStories
      : successStories.filter((story) => story.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-yellow-400 mb-4">
            회원 후기 & 성공 사례
          </h1>
          <p className="text-lg text-gray-300">
            양자요법으로 건강을 되찾은 회원들의 생생한 이야기
          </p>
        </div>

        {/* 카테고리 필터 */}
        <div className="mb-12 flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                selectedCategory === category
                  ? "bg-yellow-500 text-black"
                  : "bg-slate-700 text-gray-300 hover:bg-slate-600 border border-yellow-400/20"
              }`}
            >
              {category === "all" ? "전체" : category}
            </Button>
          ))}
        </div>

        {/* 갤러리 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              onClick={() => setSelectedStory(story)}
              className="bg-slate-800 rounded-lg overflow-hidden border border-yellow-400/20 hover:border-yellow-400 transition-all cursor-pointer hover:shadow-lg hover:shadow-yellow-400/20"
            >
              {/* 이미지 */}
              <div className="relative overflow-hidden h-48">
                <img
                  src={story.image}
                  alt={story.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
                  {story.category}
                </div>
              </div>

              {/* 콘텐츠 */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-yellow-400 mb-2">
                  {story.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4">{story.name}</p>
                <p className="text-gray-300 text-sm line-clamp-2 mb-4">
                  {story.description}
                </p>

                {/* 결과 태그 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {story.results.slice(0, 2).map((result, idx) => (
                    <span
                      key={idx}
                      className="bg-yellow-400/20 text-yellow-300 text-xs px-2 py-1 rounded"
                    >
                      {result}
                    </span>
                  ))}
                </div>

                <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 rounded-lg">
                  자세히 보기
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* 상세 모달 */}
        {selectedStory && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-yellow-400/20">
              {/* 닫기 버튼 */}
              <div className="sticky top-0 bg-slate-800 p-4 border-b border-yellow-400/20 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-yellow-400">
                  {selectedStory.title}
                </h2>
                <button
                  onClick={() => setSelectedStory(null)}
                  className="text-2xl text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="p-8 space-y-6">
                {/* 비디오 */}
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={selectedStory.videoUrl}
                    title={selectedStory.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                {/* 정보 */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-700 p-4 rounded-lg text-center border border-yellow-400/20">
                    <p className="text-gray-400 text-sm mb-2">이름</p>
                    <p className="text-yellow-400 font-bold text-lg">
                      {selectedStory.name}
                    </p>
                  </div>
                  <div className="bg-slate-700 p-4 rounded-lg text-center border border-yellow-400/20">
                    <p className="text-gray-400 text-sm mb-2">카테고리</p>
                    <p className="text-yellow-400 font-bold text-lg">
                      {selectedStory.category}
                    </p>
                  </div>
                  <div className="bg-slate-700 p-4 rounded-lg text-center border border-yellow-400/20">
                    <p className="text-gray-400 text-sm mb-2">기간</p>
                    <p className="text-yellow-400 font-bold text-lg">
                      {selectedStory.duration}
                    </p>
                  </div>
                </div>

                {/* 설명 */}
                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">
                    사례 설명
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {selectedStory.description}
                  </p>
                </div>

                {/* 결과 */}
                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">
                    개선 결과
                  </h3>
                  <div className="space-y-2">
                    {selectedStory.results.map((result, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg border border-yellow-400/20"
                      >
                        <span className="text-yellow-400 font-bold">✓</span>
                        <span className="text-gray-300">{result}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-lg text-lg">
                  나도 시작하기
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
