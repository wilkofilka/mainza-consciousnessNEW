import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings, User, Palette, Brain, MessageSquare, Monitor } from 'lucide-react';
import UserPreferencesComponent from '@/components/UserPreferences';
import LoginButton from '@/components/LoginButton';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('preferences');
  
  // For now, using a default user ID - in a real app, this would come from authentication
  const userId = 'default-user';

  const handleBackToMain = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleBackToMain}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white hover:bg-slate-700/50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Main
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Settings</h1>
                  <p className="text-slate-400 text-sm">Configure your Mainza experience</p>
                </div>
              </div>
            </div>

            <LoginButton />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="flex flex-wrap gap-1 bg-slate-800/80 p-2 rounded-lg border border-slate-700/50">
            <TabsTrigger 
              value="preferences" 
              className="flex items-center gap-1 text-white hover:text-cyan-300 data-[state=active]:text-white data-[state=active]:bg-cyan-500/30 data-[state=active]:border-cyan-400/50 border border-transparent px-3 py-1.5 text-xs rounded-md"
            >
              <User className="h-3 w-3" />
              <span>Preferences</span>
            </TabsTrigger>
            <TabsTrigger 
              value="interface" 
              className="flex items-center gap-1 text-white hover:text-cyan-300 data-[state=active]:text-white data-[state=active]:bg-cyan-500/30 data-[state=active]:border-cyan-400/50 border border-transparent px-3 py-1.5 text-xs rounded-md"
            >
              <Palette className="h-3 w-3" />
              <span>Interface</span>
            </TabsTrigger>
            <TabsTrigger 
              value="ai" 
              className="flex items-center gap-1 text-white hover:text-cyan-300 data-[state=active]:text-white data-[state=active]:bg-cyan-500/30 data-[state=active]:border-cyan-400/50 border border-transparent px-3 py-1.5 text-xs rounded-md"
            >
              <Brain className="h-3 w-3" />
              <span>AI Behavior</span>
            </TabsTrigger>
            <TabsTrigger 
              value="system" 
              className="flex items-center gap-1 text-white hover:text-cyan-300 data-[state=active]:text-white data-[state=active]:bg-cyan-500/30 data-[state=active]:border-cyan-400/50 border border-transparent px-3 py-1.5 text-xs rounded-md"
            >
              <Monitor className="h-3 w-3" />
              <span>System</span>
            </TabsTrigger>
          </TabsList>

          {/* User Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <UserPreferencesComponent userId={userId} />
          </TabsContent>

          {/* Interface Settings Tab */}
          <TabsContent value="interface" className="space-y-6">
            <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/30 border-slate-600/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Palette className="w-5 h-5 text-amber-400" />
                  Interface Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-400">
                  <p>Interface-specific settings will be available here.</p>
                  <p className="text-sm mt-2">This includes theme customization, layout options, and display preferences.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Behavior Tab */}
          <TabsContent value="ai" className="space-y-6">
            <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/30 border-slate-600/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Brain className="w-5 h-5 text-amber-400" />
                  AI Behavior Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-400">
                  <p>Advanced AI behavior settings will be available here.</p>
                  <p className="text-sm mt-2">This includes model selection, response patterns, and consciousness parameters.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings Tab */}
          <TabsContent value="system" className="space-y-6">
            <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/30 border-slate-600/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Monitor className="w-5 h-5 text-amber-400" />
                  System Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-400">
                  <p>System-level settings will be available here.</p>
                  <p className="text-sm mt-2">This includes performance settings, data management, and system diagnostics.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;
