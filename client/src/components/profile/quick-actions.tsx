import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Bookmark, Github } from "lucide-react";
import { Link } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function QuickActions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const syncGithubMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/github/sync', {
        username: 'alexjohnson-dev' // This would come from user input in a real app
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/github/data'] });
      toast({
        title: "GitHub sync successful",
        description: "Your GitHub data has been updated",
      });
    },
    onError: () => {
      toast({
        title: "GitHub sync failed",
        description: "Could not connect to GitHub. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start text-sm text-gray-600 hover:text-blue-600">
            <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
            View Skill Timeline
          </Button>
        </Link>
        
        <Link href="/saved">
          <Button variant="ghost" className="w-full justify-start text-sm text-gray-600 hover:text-blue-600">
            <Bookmark className="w-4 h-4 mr-2 text-blue-600" />
            Organize Saved Posts
          </Button>
        </Link>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sm text-gray-600 hover:text-blue-600"
          onClick={() => syncGithubMutation.mutate()}
          disabled={syncGithubMutation.isPending}
        >
          <Github className="w-4 h-4 mr-2 text-blue-600" />
          {syncGithubMutation.isPending ? 'Syncing...' : 'Sync GitHub Data'}
        </Button>
      </CardContent>
    </Card>
  );
}
