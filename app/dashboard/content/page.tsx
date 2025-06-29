import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText, Image, Video, MessageSquare, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Content',
  description: 'Manage your content library and create new content',
};

const contentItems = [
  {
    id: '1',
    title: 'Summer Product Launch Blog Post',
    type: 'blog_post',
    status: 'published',
    campaign: 'Summer Product Launch',
    createdAt: '2024-06-15',
    updatedAt: '2024-06-16',
    author: 'John Doe',
    wordCount: 1250
  },
  {
    id: '2',
    title: 'Instagram Story - New Features',
    type: 'social_post',
    status: 'draft',
    campaign: 'Summer Product Launch',
    createdAt: '2024-06-20',
    updatedAt: '2024-06-20',
    author: 'Jane Smith',
    wordCount: 45
  },
  {
    id: '3',
    title: 'Email Newsletter - June Edition',
    type: 'email',
    status: 'review',
    campaign: 'B2B Lead Generation',
    createdAt: '2024-06-18',
    updatedAt: '2024-06-19',
    author: 'Mike Johnson',
    wordCount: 800
  },
  {
    id: '4',
    title: 'Product Demo Video Script',
    type: 'video_script',
    status: 'published',
    campaign: 'Creative Portfolio Showcase',
    createdAt: '2024-05-10',
    updatedAt: '2024-05-12',
    author: 'Sarah Wilson',
    wordCount: 320
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'blog_post':
      return FileText;
    case 'social_post':
      return MessageSquare;
    case 'email':
      return MessageSquare;
    case 'video_script':
      return Video;
    case 'ad_copy':
      return Image;
    default:
      return FileText;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'draft':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'review':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    case 'archived':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  }
};

const formatType = (type: string) => {
  return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default function ContentPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content</h1>
          <p className="text-muted-foreground">
            Create, manage, and organize your content across all campaigns and channels.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Content
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +4 this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">
              75% of total content
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Review</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
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
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Work in progress
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Content</TabsTrigger>
          <TabsTrigger value="blog_post">Blog Posts</TabsTrigger>
          <TabsTrigger value="social_post">Social Media</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="video_script">Video Scripts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {contentItems.map((item) => {
            const IconComponent = getTypeIcon(item.type);
            return (
              <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <IconComponent className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <CardDescription>
                          {formatType(item.type)} • {item.campaign}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Author:</span>
                      <p className="text-muted-foreground">{item.author}</p>
                    </div>
                    <div>
                      <span className="font-medium">Word Count:</span>
                      <p className="text-muted-foreground">{item.wordCount} words</p>
                    </div>
                    <div>
                      <span className="font-medium">Created:</span>
                      <p className="text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Last Updated:</span>
                      <p className="text-muted-foreground">
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
        
        {/* Other tab contents would filter the contentItems array */}
        <TabsContent value="blog_post" className="space-y-4">
          {contentItems
            .filter(item => item.type === 'blog_post')
            .map((item) => {
              const IconComponent = getTypeIcon(item.type);
              return (
                <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <IconComponent className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <CardDescription>
                            {formatType(item.type)} • {item.campaign}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
        </TabsContent>
      </Tabs>
    </div>
  );
}