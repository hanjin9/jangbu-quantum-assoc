import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { MessageCircle, Eye, Heart } from "lucide-react";

export default function Board() {
  const { data: boardData, isLoading } = trpc.board.list.useQuery({});

  if (isLoading) return <div className="p-8">로딩 중...</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-8">커뮤니티 게시판</h1>

        <div className="grid gap-4">
          {boardData?.posts?.map((post: any) => (
            <Card key={post.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="inline-block bg-amber-500 text-white px-3 py-1 rounded-full text-sm mb-2">
                    {post.category}
                  </span>
                  <h3 className="text-xl font-semibold">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{post.author} • {post.date}</p>
                </div>
              </div>

              <div className="flex gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{post.views}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Button className="mt-8 bg-amber-500 hover:bg-amber-600">새 글 작성</Button>
      </div>
    </div>
  );
}
