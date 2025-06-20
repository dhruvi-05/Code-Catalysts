import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function ProfileCard() {
  const { data: user } = useQuery({
    queryKey: ['/api/users/me'],
  });

  if (!user) {
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="relative">
              <div className="h-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded-t-lg"></div>
              <div className="w-16 h-16 bg-gray-200 rounded-full border-4 border-white absolute -bottom-8 left-1/2 transform -translate-x-1/2"></div>
            </div>
            <div className="pt-10 pb-4 text-center">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <div className="relative">
        <div className="h-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded-t-lg"></div>
        <Avatar className="w-16 h-16 border-4 border-white absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <AvatarImage 
            src={user.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"} 
            alt="Profile" 
          />
          <AvatarFallback>
            {user.name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
      </div>
      <CardContent className="pt-10 pb-4 text-center">
        <h3 className="font-semibold text-base">{user.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{user.title}</p>
        <p className="text-xs text-gray-500">{user.company}</p>
        
        <Separator className="my-3" />
        
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs text-gray-600">
            <span>Profile viewers</span>
            <span className="text-blue-600 font-semibold">{user.profileViews || 0}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-600">
            <span>Post impressions</span>
            <span className="text-blue-600 font-semibold">{user.postImpressions || 0}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
