import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Github, 
  Award, 
  Lightbulb, 
  Plus,
  BookOpen,
  Clock,
  ArrowUp
} from "lucide-react";
import SkillChart from "@/components/skill-timeline/skill-chart";
import SkillRoadmap from "@/components/skill-timeline/skill-roadmap";
import { formatDate, generateColor } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function Growth() {
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState(50);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: skills = [] } = useQuery({
    queryKey: ['/api/skills'],
  });

  const { data: timeline = [] } = useQuery({
    queryKey: ['/api/skills/timeline'],
  });

  const { data: recommendations = [] } = useQuery({
    queryKey: ['/api/skills/recommendations'],
  });

  const { data: githubData } = useQuery({
    queryKey: ['/api/github/data'],
  });

  const { data: certifications = [] } = useQuery({
    queryKey: ['/api/certifications'],
  });

  const { data: user } = useQuery({
    queryKey: ['/api/users/me'],
  });

  const addSkillMutation = useMutation({
    mutationFn: async (skillData: { name: string; level: number }) => {
      const response = await apiRequest('POST', '/api/skills', {
        ...skillData,
        source: 'manual'
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/skills'] });
      queryClient.invalidateQueries({ queryKey: ['/api/skills/timeline'] });
      queryClient.invalidateQueries({ queryKey: ['/api/skills/recommendations'] });
      setNewSkillName("");
      setNewSkillLevel(50);
      toast({
        title: "Skill added successfully",
        description: "Your skill timeline has been updated",
      });
    },
  });

  const syncGithubMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/github/sync', {
        username: 'alexjohnson-dev'
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/github/data'] });
      queryClient.invalidateQueries({ queryKey: ['/api/skills'] });
      toast({
        title: "GitHub sync successful",
        description: "Skills updated from your GitHub activity",
      });
    },
  });

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkillName.trim()) {
      addSkillMutation.mutate({
        name: newSkillName,
        level: newSkillLevel
      });
    }
  };

  const topSkills = Array.isArray(skills) ? skills.slice(0, 6) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <Brain className="w-8 h-8 mr-3 text-blue-600" />
          Growth AI - Skill Intelligence Platform
        </h1>
        <p className="text-gray-600 mt-2">
          Visualize your professional growth with AI-powered insights from GitHub, certifications, and manual tracking
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Professional Journey Roadmap */}
          <SkillRoadmap 
            skills={Array.isArray(skills) ? skills : []}
            certifications={Array.isArray(certifications) ? certifications : []}
            githubData={githubData}
            timeline={Array.isArray(timeline) ? timeline : []}
          />

          {/* Interactive Timeline Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Skill Progression Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                <SkillChart 
                  skills={Array.isArray(skills) ? skills : []} 
                  certifications={Array.isArray(certifications) ? certifications : []}
                  githubData={githubData}
                  user={user}
                />
              </div>
              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Tracking {Array.isArray(skills) ? skills.length : 0} skills across multiple sources
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => syncGithubMutation.mutate()}
                  disabled={syncGithubMutation.isPending}
                  className="flex items-center"
                >
                  <Github className="w-4 h-4 mr-1" />
                  {syncGithubMutation.isPending ? 'Syncing...' : 'Sync GitHub'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Skill Progression Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Current Skills Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topSkills.map((skill: any, index: number) => (
                  <div key={skill.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: generateColor(index) }}
                        ></div>
                        <span className="font-medium">{skill.name}</span>
                      </div>
                      <Badge variant="outline">{skill.level}%</Badge>
                    </div>
                    <Progress value={skill.level} className="mb-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Source: {skill.source}</span>
                      <span>{formatDate(skill.lastUpdated)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                AI-Powered Learning Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recommendations && recommendations.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.map((rec: any, index: number) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold">{rec.skill}</h4>
                            <Badge 
                              variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}
                            >
                              {rec.priority} priority
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{rec.reason}</p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            Estimated time: {rec.estimatedTimeToLearn}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">AI Analysis in Progress</h3>
                  <p className="text-gray-500 mb-4">
                    Add more skills and certifications to get personalized learning recommendations
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Add New Skill */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Track New Skill
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddSkill} className="space-y-4">
                <div>
                  <Label htmlFor="skillName">Skill Name</Label>
                  <Input
                    id="skillName"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="e.g., Python, Leadership, Design"
                  />
                </div>
                <div>
                  <Label htmlFor="skillLevel">Current Level ({newSkillLevel}%)</Label>
                  <Input
                    id="skillLevel"
                    type="range"
                    min="1"
                    max="100"
                    value={newSkillLevel}
                    onChange={(e) => setNewSkillLevel(parseInt(e.target.value))}
                    className="mt-2"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={addSkillMutation.isPending || !newSkillName.trim()}
                >
                  {addSkillMutation.isPending ? 'Adding...' : 'Add Skill'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* GitHub Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Github className="w-5 h-5 mr-2" />
                GitHub Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              {githubData ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Contributions</span>
                    <span className="font-semibold text-blue-600">{githubData.contributions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Repositories</span>
                    <span className="font-semibold text-green-600">{githubData.repositories}</span>
                  </div>
                  <div className="border-t pt-3">
                    <h4 className="font-medium mb-2 text-sm">Top Languages</h4>
                    {Object.entries(githubData.languages || {})
                      .slice(0, 4)
                      .map(([language, count]: [string, any]) => (
                        <div key={language} className="flex justify-between text-sm mb-1">
                          <span>{language}</span>
                          <span className="text-gray-500">{count} repos</span>
                        </div>
                      ))}
                  </div>
                  <p className="text-xs text-gray-500 pt-2 border-t">
                    Last synced: {formatDate(githubData.lastSynced)}
                  </p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Github className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Connect GitHub</p>
                  <Button variant="outline" size="sm" onClick={() => syncGithubMutation.mutate()}>
                    Sync Repository Data
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {certifications && certifications.length > 0 ? (
                <div className="space-y-3">
                  {certifications.slice(0, 3).map((cert: any) => (
                    <div key={cert.id} className="border-l-3 border-yellow-500 pl-3">
                      <h4 className="font-medium text-sm">{cert.name}</h4>
                      <p className="text-xs text-gray-600">{cert.issuer}</p>
                      <p className="text-xs text-gray-500">{formatDate(cert.issueDate)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Award className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No certifications yet</p>
                  <p className="text-xs text-gray-500">Add certifications to boost your profile</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Growth Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Growth Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <ArrowUp className="w-4 h-4 text-green-500 mr-2" />
                  <span>3 skills improved this month</span>
                </div>
                <div className="flex items-center text-sm">
                  <BookOpen className="w-4 h-4 text-blue-500 mr-2" />
                  <span>2 new certifications earned</span>
                </div>
                <div className="flex items-center text-sm">
                  <Github className="w-4 h-4 text-purple-500 mr-2" />
                  <span>47% increase in contributions</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}