import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Newspaper, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { formatDate } from "@/lib/utils";
import CategoryGrid from "./category-grid";

export default function SavedPostsCard() {
  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ['/api/saved-posts/categories'],
  });

  const { data: digests } = useQuery({
    queryKey: ['/api/digests'],
  });

  const generateDigestMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/digests/generate', {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/digests'] });
    },
  });

  const recentDigest = digests?.[0];

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center">
            <Bookmark className="w-6 h-6 mr-2 text-blue-600" />
            Smart Saved Posts
          </CardTitle>
          <Link href="/saved">
            <Button variant="outline" size="sm">
              View All Categories
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* AI Categories Grid */}
        <CategoryGrid categories={categories} compact />

        {/* Recent Digest */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm flex items-center">
              <Newspaper className="w-4 h-4 text-blue-600 mr-2" />
              Weekly Digest
            </h3>
            <div className="flex items-center space-x-2">
              {recentDigest && (
                <span className="text-xs text-gray-600">
                  Generated {formatDate(recentDigest.generatedAt)}
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => generateDigestMutation.mutate()}
                disabled={generateDigestMutation.isPending}
                className="text-xs"
              >
                {generateDigestMutation.isPending ? 'Generating...' : 'Generate New'}
              </Button>
            </div>
          </div>

          {recentDigest ? (
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{recentDigest.title}</p>
                  <p className="text-xs text-gray-600">{recentDigest.content?.summary}</p>
                  {recentDigest.content?.categories && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {recentDigest.content.categories.slice(0, 3).map((cat: any) => (
                        <Badge key={cat.name} variant="outline" className="text-xs">
                          {cat.name} ({cat.count})
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <TrendingUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">No digest available</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateDigestMutation.mutate()}
                disabled={generateDigestMutation.isPending}
              >
                {generateDigestMutation.isPending ? 'Generating...' : 'Generate Weekly Digest'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
