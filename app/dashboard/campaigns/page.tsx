"use client";

import { useState, useEffect } from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Target, Calendar, DollarSign, TrendingUp, Users, FileText, Sparkles, Eye, Brain } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { api, ApiError } from '@/lib/api';
import { format } from 'date-fns';

interface Campaign {
  id: string;
  name: string;
  description: string;
  strategy: string;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  startDate: string | null;
  endDate: string | null;
  budget: number | null;
  createdAt: string;
  updatedAt: string;
  creator: {
    name: string;
    email: string;
  };
  persona: {
    id: string;
    name: string;
  };
  _count: {
    contents: number;
  };
}

interface Persona {
  id: string;
  name: string;
  description: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'DRAFT':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'COMPLETED':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    case 'PAUSED':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  }
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('');

  useEffect(() => {
    fetchCampaigns();
    fetchPersonas();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      const response = await api.campaigns.getAll();
      setCampaigns(response.data || []);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
      toast({
        title: "Error",
        description: "Failed to load campaigns. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPersonas = async () => {
    try {
      const response = await api.personas.getAll();
      setPersonas(response.data || []);
    } catch (error) {
      console.error('Failed to fetch personas:', error);
    }
  };

  const handleGenerateCampaign = async () => {
    if (!selectedPersonaId) {
      toast({
        title: "Error",
        description: "Please select a persona to generate a campaign for.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await api.campaigns.generate({
        personaId: selectedPersonaId,
      });

      setCampaigns(prev => [{ ...response.data, _count: { contents: 0 } }, ...prev]);
      setSelectedPersonaId('');
      setIsGenerateModalOpen(false);
      
      toast({
        title: "AI Campaign Generated!",
        description: `"${response.data.name}" has been created successfully.`,
      });
    } catch (error) {
      console.error('Generate campaign error:', error);
      
      let errorMessage = "Failed to generate campaign. Please try again.";
      
      if (error instanceof ApiError) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsViewModalOpen(true);
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'Not set';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-muted animate-pulse rounded w-32 mb-2"></div>
            <div className="h-4 bg-muted animate-pulse rounded w-64"></div>
          </div>
          <div className="h-10 bg-muted animate-pulse rounded w-32"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted animate-pulse rounded w-24"></div>
                <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted animate-pulse rounded w-20 mb-2"></div>
                <div className="h-3 bg-muted animate-pulse rounded w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE').length;
  const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
  const avgBudget = campaigns.length > 0 ? totalBudget / campaigns.length : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">
            AI-generated marketing campaigns tailored to your customer personas.
          </p>
        </div>
        <Dialog open={isGenerateModalOpen} onOpenChange={setIsGenerateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Campaign
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Generate AI Campaign
              </DialogTitle>
              <DialogDescription>
                Select a persona to generate a targeted marketing campaign using AI.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="persona">Select Persona</Label>
                <Select value={selectedPersonaId} onValueChange={setSelectedPersonaId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a persona to create a campaign for" />
                  </SelectTrigger>
                  <SelectContent>
                    {personas.map((persona) => (
                      <SelectItem key={persona.id} value={persona.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{persona.name}</span>
                          <span className="text-xs text-muted-foreground line-clamp-1">
                            {persona.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {personas.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    No personas available. Create personas first to generate campaigns.
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsGenerateModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleGenerateCampaign} 
                disabled={isGenerating || !selectedPersonaId}
              >
                {isGenerating ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Campaign
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}</div>
            <p className="text-xs text-muted-foreground">
              AI-generated campaigns
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCampaigns}</div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
            <p className="text-xs text-muted-foreground">
              Across all campaigns
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Budget</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(avgBudget)}</div>
            <p className="text-xs text-muted-foreground">
              Per campaign
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Generate Campaign Card */}
        <Card 
          className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 cursor-pointer transition-colors"
          onClick={() => setIsGenerateModalOpen(true)}
        >
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Sparkles className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Generate AI Campaign</h3>
            <p className="text-sm text-muted-foreground">
              {personas.length > 0 
                ? "Create a targeted marketing campaign from your personas using AI"
                : "Create personas first to generate campaigns"
              }
            </p>
          </CardContent>
        </Card>

        {/* Campaign Cards */}
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{campaign.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{campaign.description}</CardDescription>
                </div>
                <Badge className={getStatusColor(campaign.status)}>
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Target Persona:</span>
                    <p className="font-medium">{campaign.persona.name}</p>
                  </div>
                  
                  <div>
                    <span className="text-muted-foreground">Budget:</span>
                    <p className="font-medium">{formatCurrency(campaign.budget)}</p>
                  </div>
                  
                  <div>
                    <span className="text-muted-foreground">Start Date:</span>
                    <p className="font-medium">
                      {campaign.startDate ? format(new Date(campaign.startDate), 'MMM d, yyyy') : 'Not set'}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-muted-foreground">Content:</span>
                    <p className="font-medium">{campaign._count.contents} pieces</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Created {format(new Date(campaign.createdAt), 'MMM d')}
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleViewCampaign(campaign)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {campaigns.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="rounded-full bg-muted p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            <Brain className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {personas.length > 0 
              ? "Generate your first AI-powered marketing campaign from your existing personas."
              : "Create personas first, then generate targeted campaigns from them using AI."
            }
          </p>
          {personas.length === 0 ? (
            <Button variant="outline" asChild>
              <a href="/dashboard/personas">Create Personas</a>
            </Button>
          ) : (
            <Button onClick={() => setIsGenerateModalOpen(true)}>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate First Campaign
            </Button>
          )}
        </div>
      )}

      {/* Campaign View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {selectedCampaign?.name}
            </DialogTitle>
            <DialogDescription>
              AI-generated campaign details and strategy
            </DialogDescription>
          </DialogHeader>
          {selectedCampaign && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                    {selectedCampaign.description}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="mt-1">
                      <Badge className={getStatusColor(selectedCampaign.status)}>
                        {selectedCampaign.status.charAt(0).toUpperCase() + selectedCampaign.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Target Persona</Label>
                    <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                      {selectedCampaign.persona.name}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Budget</Label>
                    <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                      {formatCurrency(selectedCampaign.budget)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">AI-Generated Strategy</Label>
                <div className="mt-1 p-4 bg-muted rounded-md text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">
                  {selectedCampaign.strategy}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Start Date</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                    {selectedCampaign.startDate ? format(new Date(selectedCampaign.startDate), 'MMMM d, yyyy') : 'Not set'}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">End Date</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                    {selectedCampaign.endDate ? format(new Date(selectedCampaign.endDate), 'MMMM d, yyyy') : 'Not set'}
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Created By</Label>
                <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                  {selectedCampaign.creator.name} ({selectedCampaign.creator.email}) on {format(new Date(selectedCampaign.createdAt), 'MMMM d, yyyy')}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            <Button disabled>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {campaigns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Campaign Insights
            </CardTitle>
            <CardDescription>
              Optimize your marketing campaigns with AI-powered recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted">
                <h4 className="font-medium mb-2">Generate More Campaigns</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Create additional targeted campaigns for your other personas to maximize reach.
                </p>
                <Button variant="outline" size="sm" onClick={() => setIsGenerateModalOpen(true)}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Campaign
                </Button>
              </div>
              
              <div className="p-4 rounded-lg bg-muted">
                <h4 className="font-medium mb-2">View Analytics</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Monitor your platform's user data to refine your campaign strategies.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/dashboard/analytics">View Analytics</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}