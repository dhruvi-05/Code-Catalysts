import ProfileCard from "@/components/profile/profile-card";
import QuickActions from "@/components/profile/quick-actions";
import SkillTimelineCard from "@/components/skill-timeline/skill-timeline-card";
import SavedPostsCard from "@/components/saved-posts/saved-posts-card";
import PostCard from "@/components/feed/post-card";
import CreatePost from "@/components/feed/create-post";
import NewsCard from "@/components/sidebar/news-card";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['/api/posts'],
  });

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1">
          <ProfileCard />
          <QuickActions />
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2">
          <SkillTimelineCard />
          <SavedPostsCard />
          <CreatePost />
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="linkedin-card p-6">
                  <div className="animate-pulse">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 rounded"></div>
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {posts?.map((post: any) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1">
          <NewsCard />
          
          {/* Ad Space */}
          <div className="linkedin-card p-4 mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Promoted</span>
              <button className="text-gray-400 hover:text-black">
                ×
              </button>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" 
              alt="Professional development" 
              className="w-full rounded-lg mb-3"
            />
            <h5 className="font-semibold text-sm mb-1">Advance your career with AI skills</h5>
            <p className="text-xs text-gray-600 mb-3">Learn machine learning and data science from industry experts.</p>
            <button className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
