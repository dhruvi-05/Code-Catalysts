import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Image, FileText, Video } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['/api/users/me'],
  });

  const createPostMutation = useMutation({
    mutationFn: async (postContent: string) => {
      const response = await apiRequest('POST', '/api/posts', {
        content: postContent,
      });
      return response.json();
    },
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      createPostMutation.mutate(content);
    }
  };

  if (!user) return null;

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit}>
          <div className="flex items-start space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage 
                src={user.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"} 
                alt="Your profile" 
              />
              <AvatarFallback>
                {user.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <Textarea
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px] resize-none border-0 focus:ring-0 text-base"
                style={{ boxShadow: 'none' }}
              />
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                <div className="flex items-center space-x-4">
                  <Button type="button" variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                    <Image className="w-5 h-5 mr-1" />
                    Photo
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                    <Video className="w-5 h-5 mr-1" />
                    Video
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                    <FileText className="w-5 h-5 mr-1" />
                    Document
                  </Button>
                </div>
                
                <Button
                  type="submit"
                  disabled={!content.trim() || createPostMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {createPostMutation.isPending ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
