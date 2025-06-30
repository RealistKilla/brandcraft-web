"use client";

import { useState, useEffect } from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Users, Target, Brain, Calendar, User, Sparkles, Settings, ChevronDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { api, ApiError } from '@/lib/api';
import { format } from 'date-fns';

interface Application {
  id: string;
  name: string;
  applicationId: string;
}

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalRevenue: number;
    avgSpend: number;
  };
  demographics: {
    industry: Array<{ name: string; count: number }>;
    age: Array<{ name: string; count: number }>;
    location: Array<{ name: string; count: number }>;
  };
  recentUsers: Array<{
    id: string;
    company: string | null;
    jobTitle: string | null;
    industry: string | null;
    location: string | null;
    age: string | null;
    signupDate: string;
    monthlySpendUsd: number | null;
    active: boolean;
  }>;
}

interface PersonaFilters {
  industries: string[];
  ageGroups: string[];
  locations: string[];
  spendingRange: 'all' | 'low' | 'medium' | 'high';
  userStatus: 'all' | 'active' | 'inactive';
}

interface Persona {
  id: string;
  name: string;
  description: string;
  demographics: {
    ageRange?: string;
    income?: string;
    location?: string;
    education?: string;
    occupation?: string;
  };
  behaviors: {
    digitalHabits?: string[];
    purchasingBehavior?: string[];
    communicationPreferences?: string[];
    painPoints?: string[];
    motivations?: string[];
  };
  preferences: {
    contentTypes?: string[];
    channels?: string[];
    messagingTone?: string;
    valuePropositions?: string[];
    brandAttributes?: string[];
  };
  createdAt: string;
  updatedAt: string;
  creator: {
    name: string;
    email: string;
  };
  _count: {
    campaigns: number;
  };
}

export default function PersonasPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<string>('');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingApps, setIsLoadingApps] = useState(true);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedPersonaForCampaign, setSelectedPersonaForCampaign] = useState<string | null>(null);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  
  const [filters, setFilters] = useState<PersonaFilters>({
    industries: [],
    ageGroups: [],
    locations: [],
    spendingRange: 'all',
    userStatus: 'all'
  });

  // Fetch personas on component mount
  useEffect(() => {
    fetchPersonas();
    fetchApplications();
  }, []);

  // Fetch analytics when application is selected
  useEffect(() => {
    if (selectedApplication) {
      fetchAnalytics(selectedApplication);
    }
  }, [selectedApplication]);

  const fetchPersonas = async () => {
    try {
      setIsLoading(true);
      const response = await api.personas.getAll();
      setPersonas(response.data || []);
    } catch (error) {
      console.error('Failed to fetch personas:', error);
      toast({
        title: "Error",
        description: "Failed to load personas. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      setIsLoadingApps(true);
      const response = await api.applications.getAll();
      const apps = response.data || [];
      setApplications(apps);
      
      // Auto-select first application if available
      if (apps.length > 0) {
        setSelectedApplication(apps[0].applicationId);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      toast({
        title: "Error",
        description: "Failed to load applications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingApps(false);
    }
  };

  const fetchAnalytics = async (applicationId: string) => {
    try {
      setIsLoadingAnalytics(true);
      const response = await api.analytics.getData(applicationId);
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  const handleGeneratePersona = async () => {
    if (!selectedApplication) {
      toast({
        title: "Error",
        description: "Please select an application to generate persona from.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await api.personas.generate({
        applicationId: selectedApplication,
        filters: filters
      });

      // Add the new persona to the list
      setPersonas(prev => [{
        ...response.data,
        _count: { campaigns: 0 }
      }, ...prev]);
      
      toast({
        title: "AI Persona Generated!",
        description: `"${response.data.name}" has been created based on your analytics data.`,
      });
      
      setIsGenerateModalOpen(false);
    } catch (error) {
      console.error('Generate persona error:', error);
      
      let errorMessage = "Failed to generate persona. Please try again.";
      
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

  const handleCreateCampaign = async (personaId: string) => {
    setIsCreatingCampaign(true);
    setSelectedPersonaForCampaign(personaId);

    try {
      const response = await api.campaigns.generate({
        personaId: personaId
      });

      toast({
        title: "Campaign Generated!",
        description: `"${response.data.name}" has been created for this persona.`,
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
      setIsCreatingCampaign(false);
      setSelectedPersonaForCampaign(null);
    }
  };

  const handleFilterChange = (type: keyof PersonaFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const getInterestsDisplay = (persona: Persona) => {
    const interests = [
      ...(persona.behaviors.digitalHabits || []),
      ...(persona.preferences.contentTypes || []),
      ...(persona.behaviors.motivations || [])
    ].slice(0, 3);
    
    if (interests.length === 0) {
      return ['General interests', 'Professional development', 'Industry trends'];
    }
    
    return interests;
  };

  if (isLoading || isLoadingApps) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-muted animate-pulse rounded w-32 mb-2"></div>
            <div className="h-4 bg-muted animate-pulse rounded w-64"></div>
          </div>
          <div className="h-10 bg-muted animate-pulse rounded w-32"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="h-6 bg-muted rounded w-32"></div>
                  <div className="h-8 w-8 bg-muted rounded-lg"></div>
                </div>
                <div className="h-4 bg-muted rounded w-full"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-24"></div>
                    <div className="space-y-1">
                      <div className="h-3 bg-muted rounded w-full"></div>
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-20"></div>
                    <div className="flex flex-wrap gap-1">
                      <div className="h-6 bg-muted rounded w-16"></div>
                      <div className="h-6 bg-muted rounded w-20"></div>
                      <div className="h-6 bg-muted rounded w-14"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Personas</h1>
          <p className="text-muted-foreground">
            Create and manage customer personas to better understand your target audience.
          </p>
        </div>
        {applications.length > 0 && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Generate from:</label>
              <Select value={selectedApplication} onValueChange={setSelectedApplication}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Select an application" />
                </SelectTrigger>
                <SelectContent>
                  {applications.map((app) => (
                    <SelectItem key={app.applicationId} value={app.applicationId}>
                      {app.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Create Persona Card */}
        <Dialog open={isGenerateModalOpen} onOpenChange={setIsGenerateModalOpen}>
          <DialogTrigger asChild>
            <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 cursor-pointer transition-colors">
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <Sparkles className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Generate AI Persona</h3>
                <p className="text-sm text-muted-foreground">
                  {applications.length > 0 
                    ? "Use AI to create a persona based on your platform data"
                    : "Create an application first to generate personas"
                  }
                </p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Generate AI Persona
              </DialogTitle>
              <DialogDescription>
                Customize the data used to generate your persona. Select specific segments to create more targeted personas.
              </DialogDescription>
            </DialogHeader>
            
            {isLoadingAnalytics ? (
              <div className="space-y-4 py-4">
                <div className="h-4 bg-muted animate-pulse rounded w-32"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-20 bg-muted animate-pulse rounded"></div>
                  <div className="h-20 bg-muted animate-pulse rounded"></div>
                </div>
              </div>
            ) : analyticsData ? (
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium text-sm mb-1">Total Users</h4>
                    <p className="text-2xl font-bold">{analyticsData.overview.totalUsers}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium text-sm mb-1">Active Users</h4>
                    <p className="text-2xl font-bold">{analyticsData.overview.activeUsers}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Industries</Label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                      {analyticsData.demographics.industry.slice(0, 8).map((item) => (
                        <div key={item.name} className="flex items-center space-x-2">
                          <Checkbox
                            id={`industry-${item.name}`}
                            checked={filters.industries.includes(item.name)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleFilterChange('industries', [...filters.industries, item.name]);
                              } else {
                                handleFilterChange('industries', filters.industries.filter(i => i !== item.name));
                              }
                            }}
                          />
                          <Label htmlFor={`industry-${item.name}`} className="text-sm">
                            {item.name} ({item.count})
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-3 block">Age Groups</Label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                      {analyticsData.demographics.age.slice(0, 8).map((item) => (
                        <div key={item.name} className="flex items-center space-x-2">
                          <Checkbox
                            id={`age-${item.name}`}
                            checked={filters.ageGroups.includes(item.name)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleFilterChange('ageGroups', [...filters.ageGroups, item.name]);
                              } else {
                                handleFilterChange('ageGroups', filters.ageGroups.filter(a => a !== item.name));
                              }
                            }}
                          />
                          <Label htmlFor={`age-${item.name}`} className="text-sm">
                            {item.name} ({item.count})
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-3 block">Locations</Label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                      {analyticsData.demographics.location.slice(0, 8).map((item) => (
                        <div key={item.name} className="flex items-center space-x-2">
                          <Checkbox
                            id={`location-${item.name}`}
                            checked={filters.locations.includes(item.name)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleFilterChange('locations', [...filters.locations, item.name]);
                              } else {
                                handleFilterChange('locations', filters.locations.filter(l => l !== item.name));
                              }
                            }}
                          />
                          <Label htmlFor={`location-${item.name}`} className="text-sm">
                            {item.name} ({item.count})
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Spending Range</Label>
                      <Select value={filters.spendingRange} onValueChange={(value) => handleFilterChange('spendingRange', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Users</SelectItem>
                          <SelectItem value="low">Low Spenders ($0-$50)</SelectItem>
                          <SelectItem value="medium">Medium Spenders ($50-$200)</SelectItem>
                          <SelectItem value="high">High Spenders ($200+)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-2 block">User Status</Label>
                      <Select value={filters.userStatus} onValueChange={(value) => handleFilterChange('userStatus', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Users</SelectItem>
                          <SelectItem value="active">Active Only</SelectItem>
                          <SelectItem value="inactive">Inactive Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>No analytics data available. Please select an application with user data.</p>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsGenerateModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleGeneratePersona} 
                disabled={isGenerating || !analyticsData}
              >
                {isGenerating ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Persona
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Persona Cards */}
        {personas.map((persona) => (
          <Card key={persona.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{persona.name}</CardTitle>
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-4 w-4 text-primary" />
                </div>
              </div>
              <CardDescription>{persona.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Demographics</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Age: {persona.demographics.ageRange || 'Not specified'}</p>
                    <p>Income: {persona.demographics.income || 'Not specified'}</p>
                    <p>Location: {persona.demographics.location || 'Not specified'}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Key Interests</h4>
                  <div className="flex flex-wrap gap-1">
                    {getInterestsDisplay(persona).map((interest, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-xs"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Target className="h-3 w-3" />
                    {persona._count.campaigns} campaigns
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(persona.createdAt), 'MMM d')}
                  </div>
                </div>

                <div className="pt-2">
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleCreateCampaign(persona.id)}
                    disabled={isCreatingCampaign && selectedPersonaForCampaign === persona.id}
                  >
                    {isCreatingCampaign && selectedPersonaForCampaign === persona.id ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                        Creating Campaign...
                      </>
                    ) : (
                      <>
                        <Target className="h-4 w-4 mr-2" />
                        Create Campaign
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {personas.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="rounded-full bg-muted p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            <Brain className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No personas yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {applications.length > 0 
              ? "Generate your first AI-powered persona based on your platform's user data."
              : "Create an application first, then generate personas from your user analytics."
            }
          </p>
          {applications.length === 0 && (
            <Button variant="outline" asChild>
              <a href="/dashboard/applications">Create Application</a>
            </Button>
          )}
        </div>
      )}

      {personas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Persona Insights
            </CardTitle>
            <CardDescription>
              Get AI-powered recommendations for your personas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted">
                <h4 className="font-medium mb-2">View Analytics Data</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Review your platform's user data and analytics before generating new personas.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/dashboard/analytics">Go to Analytics</a>
                </Button>
              </div>
              
              <div className="p-4 rounded-lg bg-muted">
                <h4 className="font-medium mb-2">Campaign Management</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  View and manage campaigns created for your personas.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/dashboard/campaigns">View Campaigns</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}