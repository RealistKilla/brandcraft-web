"use client";

import { useState, useEffect } from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Plus, FileText, Image, Video, MessageSquare, Calendar, Eye, Instagram, Twitter, Linkedin, Facebook, Youtube, Hash, Target, User, Clock, TrendingUp, Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { api, ApiError } from '@/lib/api';
import { format } from 'date-fns';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  content: string;
  type: 'BLOG_POST' | 'SOCIAL_POST' | 'EMAIL' | 'AD_COPY' | 'LANDING_PAGE';
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
  platform: string;
  parsedContent: {
    platform: string;
    title: string;
    content: string;
    imageDescription: string;
    altText: string;
    hashtags: string[];
    callToAction: string;
    postDescription: string;
    targetAudience: string;
    bestPostingTime: string;
    engagementStrategy: string;
  } | null;
  creator: {
    name: string;
    email: string;
  };
  campaign: {
    id: string;
    name: string;
    persona: {
      name: string;
    };
  };
}

const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return Instagram;
    case 'twitter':
    case 'x':
      return Twitter;
    case 'linkedin':
      return Linkedin;
    case 'facebook':
      return Facebook;
    case 'youtube':
      return Youtube;
    case 'tiktok':
      return Video;
    default:
      return MessageSquare;
  }
};

const getPlatformColor = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
    case 'twitter':
    case 'x':
      return 'bg-blue-500 text-white';
    case 'linkedin':
      return 'bg-blue-700 text-white';
    case 'facebook':
      return 'bg-blue-600 text-white';
    case 'youtube':
      return 'bg-red-600 text-white';
    case 'tiktok':
      return 'bg-black text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PUBLISHED':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'DRAFT':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'REVIEW':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    case 'ARCHIVED':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  }
};

const formatType = (type: string) => {
  return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default function ContentPage() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setIsLoading(true);
      const response = await api.content.getAll();
      setContentItems(response.data || []);
    } catch (error) {
      console.error('Failed to fetch content:', error);
      toast({
        title: "Error",
        description: "Failed to load content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewContent = (content: ContentItem) => {
    setSelectedContent(content);
    setIsViewModalOpen(true);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${label} copied to clipboard.`,
    });
  };

  const getFilteredContent = (platform?: string) => {
    if (!platform) return contentItems;
    return contentItems.filter(item => item.platform.toLowerCase() === platform.toLowerCase());
  };

  const platforms = [...new Set(contentItems.map(item => item.platform))].filter(p => p !== 'Unknown');

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

  const publishedContent = contentItems.filter(item => item.status === 'PUBLISHED').length;
  const draftContent = contentItems.filter(item => item.status === 'DRAFT').length;
  const reviewContent = contentItems.filter(item => item.status === 'REVIEW').length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content</h1>
          <p className="text-muted-foreground">
            AI-generated content optimized for different platforms and campaigns.
          </p>
        </div>
        {contentItems.length > 0 && (
          <Button asChild>
            <a href="/dashboard/campaigns">
              <Plus className="mr-2 h-4 w-4" />
              Generate Content
            </a>
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contentItems.length}</div>
            <p className="text-xs text-muted-foreground">
              AI-generated pieces
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedContent}</div>
            <p className="text-xs text-muted-foreground">
              Live content pieces
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Review</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviewContent}</div>
            <p className="text-xs text-muted-foreground">
              Pending approval
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftContent}</div>
            <p className="text-xs text-muted-foreground">
              Work in progress
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Content</TabsTrigger>
          {platforms.map((platform) => (
            <TabsTrigger key={platform} value={platform.toLowerCase()}>
              {platform}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {contentItems.length === 0 ? (
            <Card className="border-2 border-dashed border-muted-foreground/25">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted p-6 w-24 h-24 flex items-center justify-center mb-4">
                  <FileText className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No content yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Generate your first AI-powered content from your campaigns to start building your content library.
                </p>
                <Button asChild>
                  <a href="/dashboard/campaigns">
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Content
                  </a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {contentItems.map((item) => {
                const IconComponent = getPlatformIcon(item.platform);
                return (
                  <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${getPlatformColor(item.platform)}`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg truncate">{item.title}</CardTitle>
                            <CardDescription className="line-clamp-1">
                              {item.campaign.name} • {item.campaign.persona.name}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {item.parsedContent && (
                          <div className="space-y-2">
                            <div>
                              <span className="text-xs font-medium text-muted-foreground">Content Preview:</span>
                              <p className="text-sm line-clamp-2 mt-1">
                                {item.parsedContent.content}
                              </p>
                            </div>
                            
                            {item.parsedContent.hashtags && item.parsedContent.hashtags.length > 0 && (
                              <div>
                                <span className="text-xs font-medium text-muted-foreground">Hashtags:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {item.parsedContent.hashtags.slice(0, 3).map((tag, index) => (
                                    <span key={index} className="text-xs bg-muted px-2 py-1 rounded">
                                      #{tag}
                                    </span>
                                  ))}
                                  {item.parsedContent.hashtags.length > 3 && (
                                    <span className="text-xs text-muted-foreground">
                                      +{item.parsedContent.hashtags.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(item.createdAt), 'MMM d')}
                          </div>
                          <Button size="sm" variant="outline" onClick={() => handleViewContent(item)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
        
        {platforms.map((platform) => (
          <TabsContent key={platform} value={platform.toLowerCase()} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getFilteredContent(platform).map((item) => {
                const IconComponent = getPlatformIcon(item.platform);
                return (
                  <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${getPlatformColor(item.platform)}`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg truncate">{item.title}</CardTitle>
                            <CardDescription className="line-clamp-1">
                              {item.campaign.name}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button size="sm" variant="outline" onClick={() => handleViewContent(item)} className="w-full">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Content View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedContent && (
                <>
                  {(() => {
                    const IconComponent = getPlatformIcon(selectedContent.platform);
                    return <IconComponent className="h-5 w-5" />;
                  })()}
                  {selectedContent.title}
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              AI-generated content details and metadata
            </DialogDescription>
          </DialogHeader>
          
          {selectedContent && selectedContent.parsedContent && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium">Platform</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${getPlatformColor(selectedContent.platform)}`}>
                      {(() => {
                        const IconComponent = getPlatformIcon(selectedContent.platform);
                        return <IconComponent className="h-4 w-4" />;
                      })()}
                    </div>
                    <span className="font-medium">{selectedContent.platform}</span>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(selectedContent.status)}>
                      {selectedContent.status.charAt(0).toUpperCase() + selectedContent.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium">Campaign</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                    {selectedContent.campaign.name}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Target Persona</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                    {selectedContent.campaign.persona.name}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Content</Label>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(selectedContent.parsedContent!.content, 'Content')}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
                <div className="p-4 bg-muted rounded-md text-sm whitespace-pre-wrap">
                  {selectedContent.parsedContent.content}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Call to Action</Label>
                <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                  {selectedContent.parsedContent.callToAction}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium">Image Description</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                    {selectedContent.parsedContent.imageDescription}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Alt Text</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                    {selectedContent.parsedContent.altText}
                  </div>
                </div>
              </div>

              {selectedContent.parsedContent.hashtags && selectedContent.parsedContent.hashtags.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">Hashtags</Label>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard(selectedContent.parsedContent!.hashtags.map(tag => `#${tag}`).join(' '), 'Hashtags')}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedContent.parsedContent.hashtags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                        <Hash className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium">Target Audience</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md text-sm flex items-start gap-2">
                    <Target className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    {selectedContent.parsedContent.targetAudience}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Best Posting Time</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md text-sm flex items-start gap-2">
                    <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    {selectedContent.parsedContent.bestPostingTime}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Engagement Strategy</Label>
                <div className="mt-1 p-3 bg-muted rounded-md text-sm flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  {selectedContent.parsedContent.engagementStrategy}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium">Created By</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md text-sm flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {selectedContent.creator.name} ({selectedContent.creator.email})
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Created</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {format(new Date(selectedContent.createdAt), 'MMMM d, yyyy \'at\' h:mm a')}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            <Button disabled>
              <MessageSquare className="h-4 w-4 mr-2" />
              Publish to Platform
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}