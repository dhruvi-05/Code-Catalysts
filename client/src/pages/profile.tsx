import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, Award, Github, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function Profile() {
  const { data: user } = useQuery({
    queryKey: ['/api/users/me'],
  });

  const { data: skills } = useQuery({
    queryKey: ['/api/skills'],
  });

  const { data: certifications } = useQuery({
    queryKey: ['/api/certifications'],
  });

  const { data: githubData } = useQuery({
    queryKey: ['/api/github/data'],
  });

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Profile Header */}
      <Card className="mb-6">
        <div className="relative">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-400 rounded-t-lg"></div>
          <div className="absolute -bottom-16 left-8">
            <img
              src={user.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white"
            />
          </div>
        </div>
        <CardContent className="pt-20 pb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-xl text-gray-600 mt-1">{user.title}</p>
              <p className="text-gray-500 flex items-center mt-2">
                <MapPin className="w-4 h-4 mr-1" />
                {user.company}
              </p>
              {user.bio && (
                <p className="text-gray-700 mt-4 max-w-2xl">{user.bio}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skills Section */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              {skills && skills.length > 0 ? (
                <div className="space-y-4">
                  {skills.map((skill: any) => (
                    <div key={skill.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-sm text-gray-500">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Source: {skill.source}</span>
                        <span>Updated: {formatDate(skill.lastUpdated)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No skills added yet</p>
              )}
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {certifications && certifications.length > 0 ? (
                <div className="space-y-4">
                  {certifications.map((cert: any) => (
                    <div key={cert.id} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{cert.name}</h4>
                          <p className="text-gray-600">{cert.issuer}</p>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Calendar className="w-3 h-3 mr-1" />
                            Issued: {formatDate(cert.issueDate)}
                            {cert.expiryDate && (
                              <span className="ml-4">
                                Expires: {formatDate(cert.expiryDate)}
                              </span>
                            )}
                          </div>
                        </div>
                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      {cert.skills && cert.skills.length > 0 && (
                        <div className="mt-2">
                          {cert.skills.map((skill: string) => (
                            <Badge key={skill} variant="secondary" className="mr-1 mb-1">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No certifications added yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* GitHub Stats */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Github className="w-5 h-5 mr-2" />
                GitHub Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              {githubData ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {githubData.contributions}
                      </div>
                      <div className="text-sm text-gray-500">Contributions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {githubData.repositories}
                      </div>
                      <div className="text-sm text-gray-500">Repositories</div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Top Languages</h4>
                    {githubData.languages && Object.keys(githubData.languages).length > 0 ? (
                      <div className="space-y-2">
                        {Object.entries(githubData.languages)
                          .sort((a: any, b: any) => b[1] - a[1])
                          .slice(0, 5)
                          .map(([language, count]: [string, any]) => (
                            <div key={language} className="flex justify-between items-center">
                              <span className="text-sm">{language}</span>
                              <Badge variant="outline">{count}</Badge>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No language data available</p>
                    )}
                  </div>

                  <div className="text-xs text-gray-500">
                    Last synced: {formatDate(githubData.lastSynced)}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <p>No GitHub data available</p>
                  <p className="text-xs mt-1">Sync your GitHub account to see statistics</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
