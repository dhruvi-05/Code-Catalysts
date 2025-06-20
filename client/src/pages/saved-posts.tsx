import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bookmark, TrendingUp, Code, GraduationCap, Heart, Briefcase, Newspaper } from "lucide-react";
import CategoryGrid from "@/components/saved-posts/category-grid";
import { formatDate } from "@/lib/utils";
import React from "react";

const categoryIcons: Record<string, any> = {
  "Career Insights": Briefcase,
  "Tech Resources": Code,
  "Learning": GraduationCap,
  "Inspiration": Heart,
  "Industry News": Newspaper,
  "General": Bookmark,
};

const categoryColors: Record<string, string> = {
  "Career Insights": "bg-blue-500",
  "Tech Resources": "bg-green-500",
  "Learning": "bg-purple-500",
  "Inspiration": "bg-orange-500",
  "Industry News": "bg-red-500",
  "General": "bg-gray-500",
};

export default function SavedPosts() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: savedPosts } = useQuery({
    queryKey: ['/api/saved-posts'],
  });

  const { data: categories } = useQuery({
    queryKey: ['/api/saved-posts/categories'],
  });

  const { data: digests } = useQuery({
    queryKey: ['/api/digests'],
  });

  const filteredPosts = selectedCategory 
    ? savedPosts?.filter((post: any) => post.category === selectedCategory)
    : savedPosts;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <Bookmark className="w-8 h-8 mr-3 text-blue-600" />
          Smart Saved Posts
        </h1>
        <p className="text-gray-600 mt-2">AI-organized content for better discovery and learning</p>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="posts">All Posts</TabsTrigger>
          <TabsTrigger value="digests">Digests</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-6">
          <CategoryGrid categories={categories} onCategorySelect={setSelectedCategory} />
          
          {selectedCategory && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {categoryIcons[selectedCategory] && 
                    React.createElement(categoryIcons[selectedCategory], { className: "w-5 h-5 mr-2" })
                  }
                  {selectedCategory} Posts
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-auto"
                    onClick={() => setSelectedCategory(null)}
                  >
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPosts?.map((savedPost: any) => (
                    <div key={savedPost.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="secondary">{savedPost.category || 'Uncategorized'}</Badge>
                            <span className="text-xs text-gray-500">
                              Saved {formatDate(savedPost.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">
                            Post ID: {savedPost.postId}
                          </p>
                          {savedPost.tags && savedPost.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {savedPost.tags.map((tag: string) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="posts" className="space-y-4">
          {savedPosts && savedPosts.length > 0 ? (
            savedPosts.map((savedPost: any) => (
              <Card key={savedPost.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge 
                          variant="secondary" 
                          className={`${categoryColors[savedPost.category || 'General']} text-white`}
                        >
                          {savedPost.category || 'Uncategorized'}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Saved {formatDate(savedPost.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        Post ID: {savedPost.postId}
                      </p>
                      {savedPost.tags && savedPost.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {savedPost.tags.map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No saved posts yet</h3>
                <p className="text-gray-500">
                  Start saving posts to see them organized here with AI-powered categorization
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="digests" className="space-y-4">
          {digests && digests.length > 0 ? (
            digests.map((digest: any) => (
              <Card key={digest.id}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                    {digest.title}
                    <Badge variant="outline" className="ml-auto">
                      {digest.type}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{digest.content?.summary}</p>
                  
                  {digest.content?.categories && digest.content.categories.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Content Breakdown</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {digest.content.categories.map((category: any) => (
                          <div key={category.name} className="border rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">{category.name}</span>
                              <Badge variant="secondary">{category.count}</Badge>
                            </div>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {category.highlights.map((highlight: string, index: number) => (
                                <li key={index}>• {highlight}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {digest.content?.actionItems && digest.content.actionItems.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Recommended Actions</h4>
                      <ul className="space-y-1">
                        {digest.content.actionItems.map((item: string, index: number) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <span className="text-blue-600 mr-2">→</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                    Generated {formatDate(digest.generatedAt)}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No digests available</h3>
                <p className="text-gray-500 mb-4">
                  AI-generated digests will appear here to help you review and act on your saved content
                </p>
                <Button variant="outline">
                  Generate Weekly Digest
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
