import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Award, Github, Lightbulb } from "lucide-react";
import SkillChart from "./skill-chart";
import { Link } from "wouter";

export default function SkillTimelineCard() {
  const { data: skills } = useQuery({
    queryKey: ['/api/skills'],
  });

  const { data: githubData } = useQuery({
    queryKey: ['/api/github/data'],
  });

  const { data: recommendations } = useQuery({
    queryKey: ['/api/skills/recommendations'],
  });

  const { data: certifications } = useQuery({
    queryKey: ['/api/certifications'],
  });

  const topSkills = skills?.slice(0, 3) || [];
  const recentCert = certifications?.[0];

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center">
            <Brain className="w-6 h-6 mr-2 text-blue-600" />
            AI-Powered Skill Timeline
          </CardTitle>
          <Link href="/profile">
            <Button variant="outline" size="sm">
              View Full Timeline
            </Button>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Timeline Visualization */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
          <SkillChart skills={skills} />
        </div>

        {/* Skill Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm font-semibold text-green-800">Growing Skills</p>
                <p className="text-xs text-green-600">
                  {topSkills.map(skill => skill.name).join(', ') || 'No skills yet'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center">
              <Award className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-semibold text-blue-800">Recent Certs</p>
                <p className="text-xs text-blue-600">
                  {recentCert?.name || 'No certifications yet'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="flex items-center">
              <Github className="w-5 h-5 text-purple-600 mr-2" />
              <div>
                <p className="text-sm font-semibold text-purple-800">GitHub Activity</p>
                <p className="text-xs text-purple-600">
                  {githubData?.contributions || 0} contributions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg p-4 text-white">
          <h3 className="font-semibold mb-3 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2" />
            AI Recommendations
          </h3>
          
          {recommendations && recommendations.length > 0 ? (
            <div className="space-y-2 text-sm">
              {recommendations.slice(0, 3).map((rec: any, index: number) => (
                <div key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <div>
                    <span className="font-medium">{rec.skill}</span>
                    <span className="ml-2 opacity-90">- {rec.reason}</span>
                    <Badge variant="secondary" className="ml-2 text-xs bg-white/20 text-white">
                      {rec.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <p>• Consider learning <strong>Docker & Kubernetes</strong> to complement your cloud skills</p>
              <p>• Your programming skills show growth - perfect time to tackle advanced algorithms</p>
              <p>• Based on your network, <strong>AI/ML</strong> is trending in your field</p>
            </div>
          )}
          
          <Button className="mt-3 bg-white text-blue-600 hover:bg-gray-50">
            Get Learning Path
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
