"use client";

import { useState, useEffect } from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Grid3X3, Key, Copy, Eye, EyeOff, Code, BookOpen, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { api, ApiError } from '@/lib/api';

interface Application {
  id: string;
  name: string;
  applicationId: string;
  applicationKey: string;
  createdAt: string;
  creator: {
    name: string;
    email: string;
  };
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [newAppName, setNewAppName] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch applications on component mount
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await api.applications.getAll();
      setApplications(response.data || []);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      toast({
        title: "Error",
        description: "Failed to load applications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateApplication = async () => {
    if (!newAppName.trim()) {
      toast({
        title: "Error",
        description: "Please enter an application name.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      const response = await api.applications.create({
        name: newAppName.trim(),
      });

      // Add the new application to the list
      setApplications(prev => [response.data, ...prev]);
      setNewAppName('');
      setIsCreateModalOpen(false);
      
      toast({
        title: "Application created",
        description: `${response.data.name} has been created successfully.`,
      });
    } catch (error) {
      console.error('Create application error:', error);
      
      let errorMessage = "Failed to create application. Please try again.";
      
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

  const handleViewDetails = (app: Application) => {
    setSelectedApp(app);
    setIsDetailsModalOpen(true);
    setShowKey(false);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${label} copied to clipboard.`,
    });
  };

  const codeExamples = {
    authenticate: `// Authenticate your application
const response = await fetch('https://www.brandcraft.me/api/applications/${selectedApp?.applicationId}/authenticate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    applicationId: '${selectedApp?.applicationId}',
    applicationKey: '${selectedApp?.applicationKey}'
  })
});

const result = await response.json();
console.log(result);`,

    addUser: `// Add a platform user (call this on user signup/profile update)
const response = await fetch('https://www.brandcraft.me/api/applications/${selectedApp?.applicationId}/add-platform-user', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    applicationKey: '${selectedApp?.applicationKey}',
    age: '25-34',
    company: 'Acme Corp',
    industry: 'Technology',
    jobTitle: 'Software Engineer',
    location: 'San Francisco, CA',
    monthlySpendUsd: 99.99
  })
});

const result = await response.json();
console.log(result);`
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground">
            Create and manage API applications for integrating with your services.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted w-9 h-9"></div>
                    <div>
                      <div className="h-5 bg-muted rounded w-32 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-24"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-muted rounded w-16"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-muted rounded w-24"></div>
                    <div className="h-6 bg-muted rounded w-20"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-muted rounded w-16"></div>
                    <div className="h-6 bg-muted rounded w-24"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Create Application Card */}
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 cursor-pointer transition-colors">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="rounded-full bg-muted p-4 mb-4">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Create Application</h3>
                  <p className="text-sm text-muted-foreground">
                    Create a new API application to get started
                  </p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Application</DialogTitle>
                <DialogDescription>
                  Create a new API application. You'll receive an application ID and API key for integration.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="appName">Application Name</Label>
                  <Input
                    id="appName"
                    placeholder="My Application"
                    value={newAppName}
                    onChange={(e) => setNewAppName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleCreateApplication();
                      }
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateApplication} disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Application"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Application Cards */}
          {applications.map((app) => (
            <Card 
              key={app.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleViewDetails(app)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Grid3X3 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{app.name}</CardTitle>
                      <CardDescription className="text-sm">
                        Created {new Date(app.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Application ID:</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {app.applicationId.substring(0, 12)}...
                    </code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">API Key:</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      sk_••••••••••••••••
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {applications.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="rounded-full bg-muted p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            <Grid3X3 className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Create your first API application to start integrating with your services and managing your data.
          </p>
        </div>
      )}

      {/* Application Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Grid3X3 className="h-5 w-5" />
              {selectedApp?.name}
            </DialogTitle>
            <DialogDescription>
              Application details, API credentials, and integration guide
            </DialogDescription>
          </DialogHeader>
          
          {selectedApp && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Details
                </TabsTrigger>
                <TabsTrigger value="integration" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Integration
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-6 max-h-[60vh] overflow-y-auto">
                <div className="grid gap-4">
                  <div>
                    <Label className="text-sm font-medium">Application Name</Label>
                    <div className="mt-1 p-3 bg-muted rounded-md">
                      {selectedApp.name}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Application ID</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <code className="flex-1 p-3 bg-muted rounded-md text-sm font-mono">
                        {selectedApp.applicationId}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(selectedApp.applicationId, 'Application ID')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">API Key</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <code className="flex-1 p-3 bg-muted rounded-md text-sm font-mono">
                        {showKey ? selectedApp.applicationKey : 'sk_' + '•'.repeat(32)}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowKey(!showKey)}
                      >
                        {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(selectedApp.applicationKey, 'API Key')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Keep your API key secure and never share it publicly.
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Created</Label>
                    <div className="mt-1 p-3 bg-muted rounded-md">
                      {new Date(selectedApp.createdAt).toLocaleString()}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Created By</Label>
                    <div className="mt-1 p-3 bg-muted rounded-md">
                      {selectedApp.creator.name} ({selectedApp.creator.email})
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Usage Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total Requests:</span>
                      <p className="font-medium">0</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Last Used:</span>
                      <p className="font-medium">Never</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="integration" className="space-y-6 max-h-[60vh] overflow-y-auto">
                <div className="space-y-6">
                  <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-100">Integration Overview</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        Use these endpoints to integrate Brandcraft with your platform. Call the add-platform-user endpoint whenever users sign up or update their profiles.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="h-4 w-4 text-green-600" />
                        <h4 className="font-medium">1. Authentication Endpoint</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Use this endpoint to verify your application credentials:
                      </p>
                      <div className="relative">
                        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                          <code>{codeExamples.authenticate}</code>
                        </pre>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(codeExamples.authenticate, 'Authentication code')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="h-4 w-4 text-blue-600" />
                        <h4 className="font-medium">2. Add Platform User</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Call this endpoint when users sign up or update their profiles on your platform:
                      </p>
                      <div className="relative">
                        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                          <code>{codeExamples.addUser}</code>
                        </pre>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(codeExamples.addUser, 'Add user code')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                      <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-2">Important Notes</h4>
                      <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                        <li>• Always include your application key in requests</li>
                        <li>• Call add-platform-user on user signup and profile updates</li>
                        <li>• All fields in add-platform-user are optional except applicationKey</li>
                        <li>• Use HTTPS for all API calls in production</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}