import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Calendar, 
  Award, 
  Github, 
  ExternalLink,
  Users,
  MessageCircle,
  Share2
} from "lucide-react";
import SkillRoadmap from "@/components/skill-timeline/skill-roadmap";
import { formatDate } from "@/lib/utils";

export default function PublicProfile() {
  const { data: user } = useQuery({
    queryKey: ['/api/users/me'],
  });

  const { data: skills = [] } = useQuery({
    queryKey: ['/api/skills'],
  });

  const { data: certifications = [] } = useQuery({
    queryKey: ['/api/certifications'],
  });

  const { data: githubData } = useQuery({
    queryKey: ['/api/github/data'],
  });

  const { data: timeline = [] } = useQuery({
    queryKey: ['/api/skills/timeline'],
  });

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-t-lg"></div>
          <div className="p-6">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Profile Header */}
      <Card className="mb-6">
        <div className="relative">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-400 rounded-t-lg"></div>
          <div className="absolute -bottom-16 left-8">
            <Avatar className="w-32 h-32 border-4 border-white">
              <AvatarImage 
                src={user.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"} 
                alt={user.name} 
              />
              <AvatarFallback className="text-2xl">
                {user.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <CardContent className="pt-20 pb-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-xl text-gray-600 mt-1">{user.title}</p>
              <div className="flex items-center text-gray-500 mt-2 space-x-4">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {user.company}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {user.profileViews} profile views
                </div>
              </div>
              {user.bio && (
                <p className="text-gray-700 mt-4 max-w-2xl">{user.bio}</p>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <MessageCircle className="w-4 h-4 mr-1" />
                Connect
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content - Professional Journey */}
        <div className="lg:col-span-3">
          <SkillRoadmap 
            skills={skills}
            certifications={certifications}
            githubData={githubData}
            timeline={timeline}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Skills Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Skills</CardTitle>
            </CardHeader>
            <CardContent>
              {Array.isArray(skills) && skills.length > 0 ? (
                <div className="space-y-3">
                  {skills.slice(0, 5).map((skill: any) => (
                    <div key={skill.id} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-gray-500">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {skill.source} • {formatDate(skill.lastUpdated)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No skills data available</p>
              )}
            </CardContent>
          </Card>

          {/* GitHub Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Github className="w-5 h-5 mr-2" />
                GitHub Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {githubData ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {githubData.contributions}
                      </div>
                      <div className="text-xs text-gray-500">Contributions</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {githubData.repositories}
                      </div>
                      <div className="text-xs text-gray-500">Repositories</div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2 text-sm">Languages</h4>
                    {githubData.languages && Object.keys(githubData.languages).length > 0 ? (
                      <div className="space-y-2">
                        {Object.entries(githubData.languages)
                          .sort((a: any, b: any) => b[1] - a[1])
                          .slice(0, 4)
                          .map(([language, count]: [string, any]) => (
                            <div key={language} className="flex justify-between items-center text-sm">
                              <span>{language}</span>
                              <Badge variant="outline" className="text-xs">{count}</Badge>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">No language data</p>
                    )}
                  </div>

                  <div className="text-xs text-gray-500 pt-2 border-t">
                    Last updated: {formatDate(githubData.lastSynced)}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  <Github className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No GitHub data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Award className="w-5 h-5 mr-2" />
                Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Array.isArray(certifications) && certifications.length > 0 ? (
                <div className="space-y-4">
                  {certifications.slice(0, 3).map((cert: any) => (
                    <div key={cert.id} className="border-l-4 border-yellow-500 pl-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{cert.name}</h4>
                          <p className="text-xs text-gray-600">{cert.issuer}</p>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(cert.issueDate)}
                          </div>
                        </div>
                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      {cert.skills && cert.skills.length > 0 && (
                        <div className="mt-2">
                          {cert.skills.slice(0, 2).map((skill: string) => (
                            <Badge key={skill} variant="secondary" className="mr-1 mb-1 text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {cert.skills.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{cert.skills.length - 2} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {certifications.length > 3 && (
                    <div className="text-center pt-2">
                      <Button variant="ghost" size="sm" className="text-xs">
                        View all {certifications.length} certifications
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  <Award className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No certifications available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Skills tracked</span>
                  <span className="font-semibold">{Array.isArray(skills) ? skills.length : 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Certifications</span>
                  <span className="font-semibold">{Array.isArray(certifications) ? certifications.length : 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">GitHub repos</span>
                  <span className="font-semibold">{githubData?.repositories || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Profile views</span>
                  <span className="font-semibold">{user.profileViews || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}