"use client";

import { useState, useEffect } from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Target, Calendar, DollarSign, TrendingUp, Users, FileText, Sparkles, Eye } from 'lucide-react';
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    description: '',
    strategy: '',
    personaId: '',
    startDate: '',
    endDate: '',
    budget: '',
  });

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

  const handleCreateCampaign = async () => {
    if (!newCampaign.name || !newCampaign.description || !newCampaign.strategy || !newCampaign.personaId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      const response = await api.campaigns.create({
        name: newCampaign.name,
        description: newCampaign.description,
        strategy: newCampaign.strategy,
        personaId: newCampaign.personaId,
        startDate: newCampaign.startDate || undefined,
        endDate: newCampaign.endDate || undefined,
        budget: newCampaign.budget ? parseFloat(newCampaign.budget) : undefined,
      });

      setCampaigns(prev => [{ ...response.data, _count: { contents: 0 } }, ...prev]);
      setNewCampaign({
        name: '',
        description: '',
        strategy: '',
        personaId: '',
        startDate: '',
        endDate: '',
        budget: '',
      });
      setIsCreateModalOpen(false);
      
      toast({
        title: "Campaign created",
        description: `${response.data.name} has been created successfully.`,
      });
    } catch (error) {
      console.error('Create campaign error:', error);
      
      let errorMessage = "Failed to create campaign. Please try again.";
      
      if (error instanceof ApiError) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
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
            Create, manage, and track your marketing campaigns across all channels.
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>
                Create a new marketing campaign. You can also generate campaigns automatically from your personas.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input
                    id="name"
                    placeholder="Summer Product Launch"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="persona">Target Persona</Label>
                  <Select value={newCampaign.personaId} onValueChange={(value) => setNewCampaign(prev => ({ ...prev, personaId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a persona" />
                    </SelectTrigger>
                    <SelectContent>
                      {personas.map((persona) => (
                        <SelectItem key={persona.id} value={persona.id}>
                          {persona.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the campaign objectives and target audience..."
                  value={newCampaign.description}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="strategy">Strategy</Label>
                <Textarea
                  id="strategy"
                  placeholder="Outline the marketing strategy, channels, messaging, and tactics..."
                  value={newCampaign.strategy}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, strategy: e.target.value }))}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="budget">Budget (USD)</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="5000"
                    value={newCampaign.budget}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, budget: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newCampaign.startDate}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newCampaign.endDate}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCampaign} disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Campaign"}
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
              All campaigns created
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
        {/* Create Campaign Card */}
        <Card 
          className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 cursor-pointer transition-colors"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Create Campaign</h3>
            <p className="text-sm text-muted-foreground">
              Create a new marketing campaign manually or generate one from your personas
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
            <Target className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {personas.length > 0 
              ? "Create your first marketing campaign or generate one from your existing personas."
              : "Create personas first, then generate targeted campaigns from them."
            }
          </p>
          {personas.length === 0 && (
            <Button variant="outline" asChild>
              <a href="/dashboard/personas">Create Personas</a>
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
              Campaign details and strategy
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
                <Label className="text-sm font-medium">Strategy</Label>
                <div className="mt-1 p-4 bg-muted rounded-md text-sm whitespace-pre-wrap">
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
              Edit Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}