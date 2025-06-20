import { Link, useLocation } from "wouter";
import { Search, Home, Users, Briefcase, MessageCircle, TrendingUp, Bookmark } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";

export default function Navbar() {
  const [location] = useLocation();
  
  const { data: user } = useQuery({
    queryKey: ['/api/users/me'],
  });

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/network", icon: Users, label: "My Network" },
    { path: "/jobs", icon: Briefcase, label: "Jobs" },
    { path: "/messaging", icon: MessageCircle, label: "Messaging" },
    { path: "/growth", icon: TrendingUp, label: "Growth AI" },
    { path: "/saved", icon: Bookmark, label: "Saved" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo and Search */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded text-white flex items-center justify-center font-bold text-sm">
                in
              </div>
            </Link>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search"
                className="bg-gray-100 rounded-md pl-10 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 border-0"
              />
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path || (item.path === "/growth" && location === "/");
              
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`linkedin-nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Profile */}
          <div className="flex items-center">
            <Avatar className="w-8 h-8">
              <AvatarImage 
                src={user?.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"} 
                alt="Profile" 
              />
              <AvatarFallback>
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </nav>
  );
}
