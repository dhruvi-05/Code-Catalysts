import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThumbsUp, MessageCircle, Share, Bookmark } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface PostCardProps {
  post: {
    id: number;
    content: string;
    imageUrl?: string;
    likes: number;
    comments: number;
    shares: number;
    createdAt: Date;
    author: {
      id: number;
      name: string;
      title?: string;
      profileImage?: string;
    };
  };
}

export default function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const likeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('PUT', `/api/posts/${post.id}/like`, {});
      return response.json();
    },
    onSuccess: () => {
      setIsLiked(true);
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/saved-posts', {
        postId: post.id,
      });
      return response.json();
    },
    onSuccess: () => {
      setIsSaved(true);
      queryClient.invalidateQueries({ queryKey: ['/api/saved-posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/saved-posts/categories'] });
      toast({
        title: "Post saved",
        description: "Post will be categorized automatically using AI",
      });
    },
  });

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Avatar className="w-12 h-12">
            <AvatarImage 
              src={post.author.profileImage || "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"} 
              alt={post.author.name} 
            />
            <AvatarFallback>
              {post.author.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-semibold text-sm">{post.author.name}</h4>
              {post.author.title && (
                <>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-500">{post.author.title}</span>
                </>
              )}
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500">{formatDate(post.createdAt)}</span>
            </div>
            
            <p className="text-sm text-gray-700 mb-3 whitespace-pre-wrap">
              {post.content}
            </p>
            
            {post.imageUrl && (
              <img 
                src={post.imageUrl} 
                alt="Post content" 
                className="w-full rounded-lg mb-3 max-h-96 object-cover"
              />
            )}
            
            <div className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center space-x-1 hover:text-blue-600 ${isLiked ? 'text-blue-600' : ''}`}
                  onClick={() => likeMutation.mutate()}
                  disabled={likeMutation.isPending}
                >
                  <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span>Like</span>
                  {post.likes > 0 && <span>({post.likes})</span>}
                </Button>
                
                <Button variant="ghost" size="sm" className="flex items-center space-x-1 hover:text-blue-600">
                  <MessageCircle className="w-4 h-4" />
                  <span>Comment</span>
                  {post.comments > 0 && <span>({post.comments})</span>}
                </Button>
                
                <Button variant="ghost" size="sm" className="flex items-center space-x-1 hover:text-blue-600">
                  <Share className="w-4 h-4" />
                  <span>Share</span>
                  {post.shares > 0 && <span>({post.shares})</span>}
                </Button>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className={`hover:text-blue-600 ${isSaved ? 'text-blue-600' : ''}`}
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending || isSaved}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
